const express = require("express");
const db = require("./db");

const router = express.Router();

/* Create task */
router.post("/tasks", (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  db.run(
    `INSERT INTO tasks (title, description) VALUES (?, ?)`,
    [title, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ id: this.lastID });
    }
  );
});

/* Get all tasks */
router.get("/tasks", (req, res) => {
  db.all(`SELECT * FROM tasks`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* Update task */
router.put("/tasks/:id", (req, res) => {
  const { status, title, description } = req.body;

  db.run(
    `UPDATE tasks SET title=?, description=?, status=? WHERE id=?`,
    [title, description, status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json({ message: "Task updated" });
    }
  );
});

/* Delete task */
router.delete("/tasks/:id", (req, res) => {
  db.run(`DELETE FROM tasks WHERE id=?`, req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  });
});

module.exports = router;
