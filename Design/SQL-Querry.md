1. One SELECT statement that joins two tables and limits the result set using the WHERE clause.

&emsp;SELECT d.Content, d.Volume, t.Date, t.Time<br>
&emsp;&emsp;FROM drink d<br>
&emsp;&emsp;JOIN tracker t ON d.DrinkListId = t.DrinkListId<br>
&emsp;&emsp;WHERE d.Content = "Red Bull";

2. One UPDATE statement that updates at least two columns in at least two rows.

UPDATE tracker
&emsp;Set Messages = "Drank on the way to work",
&emsp;Time = "8:00"
&emsp;Where tracker.Date = "2/8/24" AND tracker.Date = "2/9/24";
