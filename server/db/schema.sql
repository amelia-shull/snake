create table if not exists users (
    id int not null auto_increment primary key,
	pass_hash varchar(128) not null,
	username varchar(255) not null,
	CONSTRAINT UC_user UNIQUE (username)
);

create table if not exists scores (
    id int not null auto_increment primary key,
	score int not null,
	userID int not null,
	created datetime not null,
	CONSTRAINT FK_user_scores FOREIGN KEY (userID) REFERENCES users(id)
);