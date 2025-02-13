create table sender
(
    id       int auto_increment
        primary key,
    name     varchar(255) not null,
    address  varchar(255) not null,
    zip_code varchar(255) not null,
    phone    varchar(255) not null,
    email    varchar(255) not null
);

create table shop
(
    id        int auto_increment
        primary key,
    name      varchar(255) not null,
    address   varchar(255) not null,
    zip_code  varchar(255) not null,
    phone     varchar(255) not null,
    email     varchar(255) not null,
    latitude  float        null,
    longitude float        null
);

create table statuses
(
    id     int auto_increment
        primary key,
    status varchar(255) not null,
    constraint status
        unique (status)
);

create table delivery
(
    barcode         int auto_increment
        primary key,
    shop_id         int                                    not null,
    sender_id       int                                    not null,
    created_date    timestamp    default CURRENT_TIMESTAMP not null,
    delivery_time   timestamp                              null,
    delivery_status varchar(255) default 'Created'         not null,
    constraint delivery_ibfk_1
        foreign key (shop_id) references shop (id),
    constraint delivery_ibfk_2
        foreign key (sender_id) references sender (id),
    constraint delivery_ibfk_3
        foreign key (delivery_status) references statuses (status)
);

create index delivery_status
    on delivery (delivery_status);

create index sender_id
    on delivery (sender_id);

create index shop_id
    on delivery (shop_id);

create table delivery_log
(
    id          int auto_increment
        primary key,
    delivery_id int         not null,
    action      varchar(50) not null,
    action_time datetime    not null,
    constraint delivery_log_ibfk_1
        foreign key (delivery_id) references delivery (barcode)
);

create definer = Nazarii@`%` view delivery_view as
select `DAO`.`delivery`.`barcode`         AS `barcode`,
       `DAO`.`delivery`.`created_date`    AS `created_date`,
       `DAO`.`delivery`.`delivery_time`   AS `delivery_time`,
       `DAO`.`delivery`.`delivery_status` AS `delivery_status`,
       `DAO`.`shop`.`name`                AS `shop_name`,
       `DAO`.`shop`.`address`             AS `shop_address`,
       `DAO`.`shop`.`zip_code`            AS `shop_zip_code`,
       `DAO`.`shop`.`phone`               AS `shop_phone`,
       `DAO`.`shop`.`email`               AS `shop_email`,
       `DAO`.`sender`.`name`              AS `sender_name`,
       `DAO`.`sender`.`address`           AS `sender_address`,
       `DAO`.`sender`.`zip_code`          AS `sender_zip_code`,
       `DAO`.`sender`.`email`             AS `sender_email`,
       `DAO`.`sender`.`phone`             AS `sender_phone`
from ((`DAO`.`delivery` left join `DAO`.`shop`
       on ((`DAO`.`delivery`.`shop_id` = `DAO`.`shop`.`id`))) left join `DAO`.`sender`
      on ((`DAO`.`delivery`.`sender_id` = `DAO`.`sender`.`id`)));

create definer = Nazarii@`%` view pending_packages as
select `DAO`.`delivery`.`barcode` AS `barcode`,
       `s`.`name`                 AS `shop_name`,
       `s`.`address`              AS `shop_address`,
       `s`.`zip_code`             AS `shop_zipcode`,
       `s`.`phone`                AS `shop_phone`,
       `s`.`email`                AS `shop_email`
from (`DAO`.`delivery` left join `DAO`.`shop` `s` on ((`DAO`.`delivery`.`shop_id` = `s`.`id`)))
where (`DAO`.`delivery`.`delivery_status` = 'Pending delivery');

create
    definer = Nazarii@`%` procedure create_delivery(IN receiver_shop_id int, IN delivery_sender_id int)
begin
    insert into delivery (shop_id, sender_id)
    values (receiver_shop_id, delivery_sender_id);
end;

create
    definer = Nazarii@`%` procedure create_sender(IN sender_name varchar(255), IN sender_address varchar(255),
                                                  IN sender_zip_code varchar(255), IN sender_phone varchar(255),
                                                  IN sender_email varchar(255))
begin
    insert into sender (name, address, zip_code, phone, email)
    values (sender_name, sender_address, sender_zip_code, sender_phone, sender_email);
end;

create
    definer = Nazarii@`%` procedure create_shop(IN shop_name varchar(255), IN shop_address varchar(255),
                                                IN shop_zip_code varchar(255), IN shop_phone varchar(255),
                                                IN shop_email varchar(255))
begin
    insert into shop (name, address, zip_code, phone, email)
    values (shop_name, shop_address, shop_zip_code, shop_phone, shop_email);
end;

create
    definer = Nazarii@`%` procedure delivery_status_delivered(IN delivery_id int)
begin
    update delivery
    set delivery_status = 'Delivered'
    where id = delivery_id;
end;

create
    definer = Nazarii@`%` procedure delivery_status_pending(IN delivery_id int)
begin
    update delivery
    set delivery_status = 'Pending delivery'
    where id = delivery_id;
end;

