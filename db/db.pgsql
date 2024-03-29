-- SELECT * FROM pg_catalog.pg_tables;

DROP TABLE RATINGS_MOVIES;
DROP TABLE RATINGS_SHOWS;
DROP TABLE MOVIES;
DROP TABLE SHOWS;
DROP TABLE USERS;

CREATE TABLE USERS (
    ID SERIAL PRIMARY KEY,
    FIRSTNAME VARCHAR(50) NOT NULL,
    LASTNAME VARCHAR(50)
);

CREATE TABLE SHOWS (
    IMDB_ID VARCHAR(9) PRIMARY KEY,
    TITLE VARCHAR(100),
    YEAR_START INT,
    YEAR_END INT,
    POSTER_LINK VARCHAR(100),
    PLOT_SHORT VARCHAR(300),
    DETAILS_LINK VARCHAR(100),
    GENRE VARCHAR(100),
    RUNTIME INT,
    SEASONS INT,
    REWATCH BOOLEAN NULL,
    USER_ID INT,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

CREATE TABLE RATINGS_SHOWS (
    IMDB_ID VARCHAR(9) PRIMARY KEY REFERENCES SHOWS(IMDB_ID),
    IMDB INT NULL,
    IMDB_VOTES INT NULL,
    ROTTEN_TOMATOES INT NULL,
    METACRITIC INT NULL,
    USER_RATING INT NULL,
    USER_COMMENTS VARCHAR(1000) NULL
);

CREATE TABLE MOVIES (
    IMDB_ID VARCHAR(9) PRIMARY KEY,
    TITLE VARCHAR(100),
    YEAR INT,
    POSTER_LINK VARCHAR(100) NULL,
    PLOT_SHORT VARCHAR(300),
    DETAILS_LINK VARCHAR(100),
    GENRE VARCHAR(100),
    RUNTIME INT,
    REWATCH BOOLEAN NULL,
    USER_ID INT,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    CHECK (IMDB_ID LIKE 'tt_______')
);

CREATE TABLE RATINGS_MOVIES (
    IMDB_ID VARCHAR(9) PRIMARY KEY REFERENCES MOVIES(IMDB_ID),
    IMDB INT NULL,
    IMDB_VOTES INT NULL,
    ROTTEN_TOMATOES INT NULL,
    METACRITIC INT NULL,
    USER_RATING INT NULL,
    USER_COMMENTS VARCHAR(1000) NULL
);
