import bcrypt

password = "123456"

# Hash oluştur
hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

print(hashed.decode("utf-8"))