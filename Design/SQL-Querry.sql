-- One SELECT statement that joins two tables and limits the result set using the WHERE clause.
SELECT d.Content, d.Volume, t.Date, t.Time
    FROM drink d
    JOIN tracker t ON d.DrinkListId = t.DrinkListId
    WHERE d.Content = "Red Bull";

-- One UPDATE statement that updates at least two columns in at least two rows.
UPDATE tracker
    Set Messages = "Drank on the way to work",
    Time = "8:00"
    Where tracker.Date = "2/8/24" AND tracker.Date = "2/9/24";
