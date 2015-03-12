conn = new Mongo();
db = conn.getDB("expsys");

db.dropDatabase();
