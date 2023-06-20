DROP DATABASE IF EXISTS shareandsave;

CREATE DATABASE shareandsave;

USE shareandsave;

/* Stores user's data */
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
	pass VARCHAR(60) NOT NULL, /* Prepared to store encrypted passwords using bcryptjs */
	name VARCHAR(25) NOT NULL,
	surname VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	level TINYINT NOT NULL DEFAULT 1, /* 1 = normal, 2 = premium, 3 = admin */
	PRIMARY KEY (id),
	UNIQUE KEY k_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO users (name, surname, email, pass, level) VALUES (
    "Admin",
    "Share and Save",
    "shareandsaveapp@gmail.com",
    "$2a$10$mxBKBQqceNJDLnbLOHEcpu853pwqCgfzCgcaGD0YJeM/6yL6CczAa", /* shareandsave */
    3
);

CREATE TABLE workspace (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE workspace_members (
    workspace INT NOT NULL,
    user INT NOT NULL,
    admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (workspace, user),
    KEY fk_workspacemembers_user (user),
    CONSTRAINT fk_workspacemembers_workspace FOREIGN KEY (workspace) REFERENCES workspace (id),
    CONSTRAINT fk_workspacemembers_user FOREIGN KEY (user) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE category (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY k_category_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO category (name) VALUES
    ("No especificado"),
    ("Suministro de agua"),
    ("Alimentación"),
    ("Restaurantes y bares"),
    ("Alquiler e hipotecas"),
    ("Cosméticos"),
    ("Entretenimiento"),
    ("Viajes"),
    ("Formación"),
    ("Higiene personal"),
    ("Hogar"),
    ("Impuestos y tasas"),
    ("Becas y subvenciones"),
    ("Salario"),
    ("Internet y móviles"),
    ("Inversiones"),
    ("Limpieza"),
    ("Electricidad"),
    ("Mascotas"),
    ("Regalos"),
    ("Ropa y calzado"),
    ("Salud"),
    ("Transporte"),
    ("Crianza"),
    ("Deportes"),
    ("Conciertos y espectáculos"),
    ("Reparaciones")
;

CREATE TABLE place (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY k_place_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO place (name) VALUES ("No especificado");

CREATE TABLE record (
    id INT NOT NULL AUTO_INCREMENT,
    type TINYINT NOT NULL DEFAULT 1, /* 1 = spend, 2 = earn */
    date DATE NOT NULL,
    description VARCHAR(100) DEFAULT NULL,
    amount DECIMAL(8, 2) DEFAULT 0.0,
    reference VARCHAR(50) DEFAULT NULL,
    shared BOOLEAN DEFAULT TRUE,
    category INT NOT NULL,
    place INT NOT NULL DEFAULT 1,
    user INT NOT NULL,
    workspace INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_record_category FOREIGN KEY (category) REFERENCES category (id),
    CONSTRAINT fk_record_place FOREIGN KEY (place) REFERENCES place (id),
    CONSTRAINT fk_record_user FOREIGN KEY (user) REFERENCES users (id),
    CONSTRAINT fk_record_workspace FOREIGN KEY (workspace) REFERENCES workspace (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
