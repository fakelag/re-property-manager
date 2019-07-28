using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using backend.Models;

namespace backend.Services
{
	public class JwtService
	{
		private readonly IBackendSettings _settings;

		public JwtService(IBackendSettings settings)
		{
			_settings = settings;
		}

		public string WriteToken(string userId)
		{
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Issuer = null,
				Audience = null,
				IssuedAt = DateTime.UtcNow,
				NotBefore = DateTime.UtcNow,
				Expires = DateTime.UtcNow.AddMinutes(_settings.JwtLifeTimeMinutes),
				Subject = new ClaimsIdentity(new Claim[] 
                {
                    new Claim(ClaimTypes.Name, userId),
                }),
				SigningCredentials = new SigningCredentials(
					new SymmetricSecurityKey(Convert.FromBase64String(_settings.JwtSecret)), SecurityAlgorithms.HmacSha256Signature)
			};

			var jwtTokenHandler = new JwtSecurityTokenHandler();
			var jwtToken = jwtTokenHandler.CreateJwtSecurityToken(tokenDescriptor);

			return jwtTokenHandler.WriteToken(jwtToken);
		}

		public string ReadToken(string token)
		{
			var handler = new JwtSecurityTokenHandler();
			var validations = new TokenValidationParameters
			{
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String(_settings.JwtSecret)),
				ValidateIssuer = false,
				ValidateAudience = false
			};
			var claims = handler.ValidateToken(token, validations, out var tokenSecure);
			return claims.Identity.Name;
		}
	}
}
