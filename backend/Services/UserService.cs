using System;
using System.Linq;
using System.Security.Cryptography;
using backend.Models;
using MongoDB.Driver;

namespace backend.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IDatabaseSettings settings, MongoService service)
        {
            _users = service.GetDatabase().GetCollection<User>(settings.Collections.Users);
        }

        public User Get(string id) => _users.Find<User>(user => user.Id == id).FirstOrDefault();

		public User GetByUserName(string username) =>
			_users.Find<User>(user => user.Username == username).FirstOrDefault();

        public User Create(User user)
        {
            _users.InsertOne(user);
            return user;
        }

		public User CreateAdminUser(string username, string password)
		{
			var user = _users.Find(usr => usr.Username == username).FirstOrDefault();

			if (user != null)
				return user;

			user = new User();

			user.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
			user.Username = username;
			user.Password = password;

			Create(user);
			SetPassword(user.Id, password);

			return user;
		}

		public void SetPassword(string id, string password)
		{
			byte[] salt;
			new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

			var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000);
			byte[] hash = pbkdf2.GetBytes(20);

			byte[] hashBytes = new byte[36];
			Array.Copy(salt, 0, hashBytes, 0, 16);
			Array.Copy(hash, 0, hashBytes, 16, 20);

			string passwordHash = Convert.ToBase64String(hashBytes);

			var update = Builders<User>.Update.Set("password", passwordHash);
            _users.FindOneAndUpdate<User>(user => user.Id == id, update);
		}

		public bool VerifyPassword(string id, string password)
		{
			var user = _users.Find<User>(usr => usr.Id == id).FirstOrDefault();

			if (user == null)
				return false;

			byte[] hashBytes = Convert.FromBase64String(user.Password);

			byte[] salt = new byte[16];
			Array.Copy(hashBytes, 0, salt, 0, 16);

			byte[] hash = new Rfc2898DeriveBytes(password, salt, 10000).GetBytes(20);

			for (int i=0; i < 20; i++)
			{
				if (hashBytes[i + 16] != hash[i])
					return false;
			}

			return true;
		}
    }
}
