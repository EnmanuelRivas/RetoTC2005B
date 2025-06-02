# RetoTC2005B

## Environment Variables

This project uses environment variables for configuration. To set up your environment:

1. Create a `.env` file in the `/backend` directory with the following variables:
```
# Database configuration
HOST=localhost
DB_USER=youruser
PASSWORD=yourpassword
DATABASE=yourdatabase

# JWT Secret
SECRET=your_jwt_secret_key
```

2. Replace the values with your actual configuration.

3. Note: The `.env` file is excluded from git in the `.gitignore` file to keep sensitive information secure. Never commit your actual `.env` file to version control. 