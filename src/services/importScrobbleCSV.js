const db = require("../db");
const fastCsv = require("fast-csv");
const { Readable } = require("stream");

function importScrobbleCSV(buffer, res) {
  try {
    const stream = Readable.from(buffer.toString());

    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO scrobbles
      (artist, track, album, album_image, played_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insertStmt.run(
          row.artist,
          row.track,
          row.album || null,
          row.album_image || null,
          Number(row.played_at)
        );
      }
    });

    const rows = [];

    stream
      .pipe(fastCsv.parse({ headers: true, ignoreEmpty: true }))
      .on("error", (err) => {
        console.error(err);
        res.status(400).json({ error: "CSV inválido" });
      })
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        insertMany(rows);
        res.json({ imported: rows.length });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
module.exports ={
  importScrobbleCSV
}
