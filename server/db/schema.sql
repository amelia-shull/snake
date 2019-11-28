create table if not exists users (
    id int not null auto_increment primary key,
	email varchar(320) not null,
	pass_hash varchar(128) not null,
	username varchar(255) not null,
	first_name varchar(64),
	last_name varchar(128),
	photo_url varchar(128) not null,
	CONSTRAINT UC_email UNIQUE (email)
);

create table if not exists scores (
    id int not null auto_increment primary key,
	score int not null,
	userID int,
	CONSTRAINT FK_user_scores FOREIGN KEY (userID) REFERENCES users(id)
);

alter table users add CONSTRAINT UC_username UNIQUE (username);