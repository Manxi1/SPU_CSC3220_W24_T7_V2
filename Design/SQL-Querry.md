1. One SELECT statement that joins two tables and limits the result set using the WHERE clause.

&emsp;&emsp;SELECT d.Content, d.Volume, t.Date, t.Time<br>
&emsp;&emsp;&emsp;FROM drink d<br>
&emsp;&emsp;&emsp;JOIN tracker t ON d.DrinkListId = t.DrinkListId<br>
&emsp;&emsp;&emsp;WHERE d.Content = "Red Bull";

2. One UPDATE statement that updates at least two columns in at least two rows.

&emsp;&emsp;UPDATE tracker<br>
&emsp;&emsp;&emsp;Set Messages = "Drank on the way to work",<br>
&emsp;&emsp;&emsp;Time = "8:00"<br>
&emsp;&emsp;&emsp;Where tracker.Date = "2/8/24" AND tracker.Date = "2/9/24";<br>
