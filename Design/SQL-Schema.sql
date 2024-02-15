--
-- File generated with SQLiteStudio v3.4.4 on Sat Feb 10 10:14:07 2024
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: Drink
CREATE TABLE Drink (
    DrinkId     INTEGER PRIMARY KEY AUTOINCREMENT,
    Content     TEXT    NOT NULL,
    Volume      NUMERIC DEFAULT (0),
    Calories    NUMERIC DEFAULT (0),
    Sugar       NUMERIC DEFAULT (0),
    Caffeine    NUMERIC DEFAULT (0),
    DrinkListId INTEGER REFERENCES Tracker (DrinkListId) 
);


-- Table: Goal
CREATE TABLE Goal (
    GoalId      INTEGER PRIMARY KEY AUTOINCREMENT,
    WaterIntake INTEGER DEFAULT (0),
    Volume      NUMERIC DEFAULT (0),
    Calories    NUMERIC DEFAULT (0),
    Sugar       NUMERIC DEFAULT (0),
    Caffeine    NUMERIC DEFAULT (0),
    DrinkListId INTEGER REFERENCES Tracker (DrinkListId) 
);


-- Table: Tracker
CREATE TABLE Tracker (
    DrinkListId INTEGER PRIMARY KEY AUTOINCREMENT,
    Message     TEXT,
    Date        TEXT    NOT NULL,
    Time        TEXT    NOT NULL,
    GoalId      INTEGER REFERENCES Goal (GoalId) 
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
