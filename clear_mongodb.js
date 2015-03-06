conn = new Mongo();
db = conn.getDB("express-system");

db.dropDatabase();
