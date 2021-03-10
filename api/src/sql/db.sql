CREATE DATABASE db_salud_ciudad;

USE db_salud_ciudad;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE usuarios (
  id INT(11) NOT NULL PRIMARY KEY ,
  usuario VARCHAR(32) NOT NULL,
  contrasenia VARCHAR(60) NOT NULL,
  nombre VARCHAR(100) NOT NULL
);

ALTER TABLE usuarios
  ADD PRIMARY KEY (id);

ALTER TABLE usuarios
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE usuarios;

INSERT INTO users (id, username, password, fullname) 
  VALUES (1, 'john', 'password1', 'John Carter');

SELECT * FROM users;
