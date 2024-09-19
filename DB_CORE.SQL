-- Criação do banco de dados 'core'
CREATE DATABASE core;

-- Criação do usuário 'core_user' com a senha 'Wecom12#'
CREATE USER core_user WITH ENCRYPTED PASSWORD 'Wecom12#';

-- Conceder todas as permissões no banco de dados 'core' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON DATABASE core TO core_user;

-- Conectar ao banco de dados 'core' como 'core_user'
\c core

-- Criação da tabela 'configs' no schema 'public'
CREATE TABLE public.configs (
    id bigserial NOT NULL,
    entry text NOT NULL,
    value text NULL,
    "createdAt" text NULL,
    "updatedAt" text NULL,
    CONSTRAINT configs_pkey PRIMARY KEY (id)
);

-- Inserção dos dados na tabela 'configs'
INSERT INTO public.configs (id, entry, value) VALUES
(1, 'urlalarmserver', ''),
(2, 'urlEnable', 'false'),
(3, 'urlalarmserver', ''),
(10, 'chatNotification', 'https://core.wecom.com.br/src/assets/sounds/bleep'),
(7, 'customHeaders', '{}'),
(4, 'googleApiKey', ''),
(11, 'alarmNotification', 'https://core.wecom.com.br/src/assets/sounds/mobil'),
(12, 'sensorNotification', 'https://core.wecom.com.br/src/assets/sounds/suspi'),
(9, 'licenseFile', ''),
(8, 'licenseKey', ''),
(6, 'pbxType', ''),
(5, 'urlPbxTableUsers', '');


-- public.iot_cameras definition

-- Drop table

-- DROP TABLE public.iot_cameras;

CREATE TABLE public.iot_cameras (
	mac text NULL,
	nickname text NULL,
	create_user text NULL,
	"createdAt" date NULL,
	"updatedAt" date NULL,
	id bigserial NOT NULL
);

-- public.iot_devices_history definition

-- Drop table

-- DROP TABLE public.iot_devices_history;

CREATE TABLE public.iot_devices_history (
	id int8 DEFAULT nextval('list_sensors_history_id_seq'::regclass) NOT NULL,
	"date" text NULL,
	sensor_name varchar NULL,
	deveui varchar NULL,
	battery varchar NULL,
	co2 varchar NULL,
	humidity varchar NULL,
	temperature varchar NULL,
	leak varchar NULL,
	pir varchar NULL,
	light_level varchar NULL,
	hcho varchar NULL,
	pm2_5 varchar NULL,
	pm10 varchar NULL,
	o3 varchar NULL,
	tvoc varchar NULL,
	pressure varchar NULL,
	magnet_status int8 NULL,
	tamper_status int8 NULL,
	daylight varchar NULL,
	image varchar NULL,
	wind_direction varchar NULL,
	wind_speed varchar NULL,
	rainfall_total varchar NULL,
	rainfall_counter varchar NULL,
	power varchar NULL,
	total_current varchar NULL,
	"current" varchar NULL,
	alarm varchar NULL,
	press varchar NULL,
	"adc-1" numeric NULL,
	"adc-1-avg" numeric NULL,
	"adc-1-max" numeric NULL,
	"adc-1-min" numeric NULL,
	"adc-2" numeric NULL,
	"adc-2-avg" numeric NULL,
	"adc-2-max" numeric NULL,
	"adc-2-min" numeric NULL,
	"adv-1" numeric NULL,
	"adv-2" numeric NULL,
	"counter-1" int4 NULL,
	"counter-2" int4 NULL,
	"counter-3" int4 NULL,
	"counter-4" int4 NULL,
	"gpio-in-1" varchar NULL,
	"gpio-in-2" varchar NULL,
	"gpio-in-3" varchar NULL,
	"gpio-in-4" varchar NULL,
	"gpio-out-1" varchar NULL,
	"gpio-out-2" varchar NULL,
	"pt100-1" int4 NULL,
	"pt100-2" int4 NULL,
	people_count_all numeric NULL,
	people_count_max numeric NULL,
	people_total_in numeric NULL,
	people_total_out numeric NULL,
	people_in numeric NULL,
	people_out numeric NULL,
	region_1 numeric NULL,
	region_2 numeric NULL,
	region_3 numeric NULL,
	region_4 numeric NULL,
	region_5 numeric NULL,
	region_6 numeric NULL,
	region_7 numeric NULL,
	region_8 numeric NULL,
	region_9 numeric NULL,
	region_10 numeric NULL,
	region_11 numeric NULL,
	region_12 numeric NULL,
	region_13 numeric NULL,
	region_14 numeric NULL,
	region_15 numeric NULL,
	region_16 numeric NULL,
	a_to_a numeric NULL,
	a_to_b numeric NULL,
	a_to_c numeric NULL,
	a_to_d numeric NULL,
	b_to_a numeric NULL,
	b_to_b numeric NULL,
	b_to_c numeric NULL,
	b_to_d numeric NULL,
	c_to_a numeric NULL,
	c_to_b numeric NULL,
	c_to_c numeric NULL,
	c_to_d numeric NULL,
	d_to_a numeric NULL,
	d_to_b numeric NULL,
	d_to_c numeric NULL,
	d_to_d numeric NULL,
	CONSTRAINT list_sensors_history_pkey PRIMARY KEY (id)
);

-- public.iot_gateways definition

-- Drop table

-- DROP TABLE public.iot_gateways;

CREATE TABLE public.iot_gateways (
	id bigserial NOT NULL,
	host varchar NOT NULL,
	userapi varchar NOT NULL,
	"password" varchar NOT NULL,
	"createdAt" varchar NULL,
	"updatedAt" varchar NULL,
	nickname varchar NULL
);

-- public.list_actions definition

-- Drop table

-- DROP TABLE public.list_actions;

CREATE TABLE public.list_actions (
	id int8 DEFAULT nextval('list_alarm_actions_id_seq'::regclass) NOT NULL,
	"createdAt" date NULL,
	"updatedAt" date NULL,
	action_name text NULL,
	action_start_prt text NULL,
	action_start_type text NULL,
	action_start_device text NULL,
	action_start_device_parameter text NULL,
	action_exec_prt text NULL,
	action_exec_user text NULL,
	action_exec_type text NULL,
	action_exec_type_command_mode text NULL,
	action_exec_device text NULL,
	create_user text NULL,
	CONSTRAINT list_alarm_actions_pkey PRIMARY KEY (id)
);

-- public.list_active_alarms definition

-- Drop table

-- DROP TABLE public.list_active_alarms;

CREATE TABLE public.list_active_alarms (
	id bigserial NOT NULL,
	"from" varchar NOT NULL,
	"date" varchar NOT NULL,
	prt varchar NOT NULL,
	btn_id varchar NOT NULL
);

-- public.list_buttons definition

-- Drop table

-- DROP TABLE public.list_buttons;

CREATE TABLE public.list_buttons (
	id bigserial NOT NULL,
	button_name varchar(50) NULL,
	button_prt text NULL,
	button_user varchar(50) NULL,
	button_type varchar(50) NOT NULL,
	button_type_1 varchar(50) NULL,
	button_type_2 varchar(50) NULL,
	button_type_3 varchar(50) NULL,
	button_type_4 varchar(50) NULL,
	button_device varchar(50) NULL,
	sensor_min_threshold text NULL,
	sensor_max_threshold text NULL,
	sensor_type text NULL,
	create_user text NULL,
	page text NULL,
	position_x text NULL,
	position_y text NULL,
	img text NULL,
	"createdAt" date NOT NULL,
	"updatedAt" date NULL,
	gateway_id int8 NULL,
	muted bool NULL,
	CONSTRAINT list_buttons_pkey PRIMARY KEY (id)
);
-- public.tbl_activities definition

-- Drop table

-- DROP TABLE public.tbl_activities;

CREATE TABLE public.tbl_activities (
	id bigserial NOT NULL,
	guid varchar(120) NOT NULL,
	"from" varchar(120) NULL,
	"name" varchar(120) NULL,
	"date" text NULL,
	status text NULL,
	prt text NULL,
	details text NULL,
	CONSTRAINT tbl_activities_pkey PRIMARY KEY (id)
);

-- public.tbl_availability definition

-- Drop table

-- DROP TABLE public.tbl_availability;

CREATE TABLE public.tbl_availability (
	id bigserial NOT NULL,
	guid varchar(120) NOT NULL,
	"name" varchar(120) NULL,
	"date" text NULL,
	status text NULL,
	details text NULL,
	CONSTRAINT tbl_availability_pkey PRIMARY KEY (id)
);

-- public.tbl_calls definition

-- Drop table

-- DROP TABLE public.tbl_calls;

CREATE TABLE public.tbl_calls (
	id bigserial NOT NULL,
	guid varchar(120) NOT NULL,
	"number" varchar(120) NULL,
	call_started text NULL,
	call_ringing text NULL,
	call_connected text NULL,
	call_ended text NULL,
	status int4 NULL,
	direction varchar(50) NULL,
	record_id text NULL,
	btn_id text NULL,
	call_innovaphone int8 NULL,
	device text NULL,
	CONSTRAINT tbl_calls_pkey PRIMARY KEY (id)
);
-- public.tbl_messages definition

-- Drop table

-- DROP TABLE public.tbl_messages;

CREATE TABLE public.tbl_messages (
	id bigserial NOT NULL,
	chat_id text NOT NULL,
	from_guid text NULL,
	to_guid text NULL,
	"date" text NULL,
	msg text NULL,
	delivered text NULL,
	"read" text NULL,
	CONSTRAINT tbl_messages_pkey PRIMARY KEY (id)
);
-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id bigserial NOT NULL,
	"name" text NOT NULL,
	email text NULL,
	"password" text NULL,
	"createdAt" text NULL,
	"updatedAt" text NULL,
	"type" text NULL,
	guid text NOT NULL,
	sip text NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Inserção dos dados na tabela 'configs'
INSERT INTO public.users ("name", email,"password","createdAt","type",guid) VALUES
('Administrador', 'admin@wecom.com.br','$2a$15$OFM4/8HzxjsFvzVz57T1ie6CwLWroYkDtSE1v4mttNcx993CU2xCW',to_char(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS'),'admin','6969696969696969696');


-- Conceder permissões na tabela 'configs' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.configs TO core_user;
-- Conceder permissões na tabela 'iot_cameras' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.iot_cameras TO core_user;
-- Conceder permissões na tabela 'iot_devices_history' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.iot_devices_history TO core_user;

-- Conceder permissões na tabela 'iot_gateways' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.iot_gateways TO core_user;

-- Conceder permissões na tabela 'list_actions' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.list_actions TO core_user;

-- Conceder permissões na tabela 'list_active_alarms' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.list_active_alarms TO core_user;
-- Conceder permissões na tabela 'list_buttons' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.list_buttons TO core_user;
-- Conceder permissões na tabela 'tbl_activities' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.tbl_activities TO core_user;

-- Conceder permissões na tabela 'tbl_availability' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.tbl_availability TO core_user;
-- Conceder permissões na tabela 'tbl_calls' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.tbl_calls TO core_user;
-- Conceder permissões na tabela 'tbl_messages' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.tbl_messages TO core_user;
-- Conceder permissões na tabela 'users' ao usuário 'core_user'
GRANT ALL PRIVILEGES ON TABLE public.users TO core_user;

