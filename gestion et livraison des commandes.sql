CREATE DATABASE gestionLivCli;
USE gestionLivCli;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
	firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('client','livreur','admin')
)ENGINE = InnoDB;

CREATE TABLE notifications(
	id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
)ENGINE = InnoDB;

create table commandes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    status ENUM('creee','En_cours','Expediee','Livree','Annulee') DEFAULT 'creee',
    user_id INT,
	FOREIGN KEY (user_id) REFERENCES users(id)
)ENGINE =InnoDB;

CREATE TABLE offers(
	id INT AUTO_INCREMENT PRIMARY KEY,
    prix DECIMAL(10,2),
    status ENUM('En_attente','Acceptee','Refusee'),
    commande_id INT NOT NULL,
    livreur_id INT NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes(id),
    FOREIGN KEY (livreur_id) REFERENCES users(id)
)ENGINE = InnoDB;

ALTER TABLE commandes
CHANGE COLUMN user_id client_id INT;