from pymongo import MongoClient

client = MongoClient(
    host='0.0.0.0',
    port=27017,
    # username='admin',
    # password='admin',
)

MongoDB = client['materialdb']
MongoDB.command("ping")
print("connected to MongoDB")