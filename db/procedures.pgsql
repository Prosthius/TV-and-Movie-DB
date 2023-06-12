CREATE PROCEDURE add_user(firstname VARCHAR(50), lastname VARCHAR(50))
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO USERS (
        FIRSTNAME,
        LASTNAME
    ) VALUES (
        firstname,
        lastname
    );
END;
$$;

DROP PROCEDURE add_movie;
CREATE PROCEDURE add_movie(
    imdb_id VARCHAR(9),
    title VARCHAR(100),
    year INT,
    poster_link VARCHAR(100),
    plot_short VARCHAR(300),
    details_link VARCHAR(100),
    genre VARCHAR(100),
    runtime INT,
    rewatch BOOLEAN,
    user_id INT
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO MOVIES (
        IMDB_ID,
        TITLE,
        YEAR,
        POSTER_LINK,
        PLOT_SHORT,
        DETAILS_LINK,
        GENRE,
        RUNTIME,
        REWATCH,
        USER_ID
    ) VALUES (
        imdb_id,
        title,
        year,
        poster_link,
        plot_short,
        details_link,
        genre,
        runtime,
        rewatch,
        user_id
    );
    
EXCEPTION WHEN check_violation THEN
    RAISE EXCEPTION 'ImdbID not valid';
WHEN OTHERS THEN
    RAISE USING ERRCODE = SQLSTATE, MESSAGE = SQLERRM;
END;
$$;

-- TODO: change the values to match updated values in table
DROP PROCEDURE add_show;
CREATE PROCEDURE add_show(
    imdb_id VARCHAR(9),
    title VARCHAR(100),
    year INT,
    poster_link VARCHAR(100),
    plot_short VARCHAR(300),
    details_link VARCHAR(100),
    genre VARCHAR(100),
    runtime INT,
    rewatch BOOLEAN,
    user_id INT
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO SHOW (
        IMDB_ID,
        TITLE,
        YEAR_START,
        YEAR_END,
        POSTER_LINK,
        PLOT_SHORT,
        DETAILS_LINK,
        GENRE,
        SEASONS,
        REWATCH,
        USER_ID
    ) VALUES (
        imdb_id,
        title,
        year,
        poster_link,
        plot_short,
        details_link,
        genre,
        runtime,
        rewatch,
        user_id
    );
    
EXCEPTION WHEN check_violation THEN
    RAISE EXCEPTION 'ImdbID not valid';
WHEN OTHERS THEN
    RAISE USING ERRCODE = SQLSTATE, MESSAGE = SQLERRM;
END;
$$;
