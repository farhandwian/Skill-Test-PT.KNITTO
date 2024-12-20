PGDMP     #                	    |            Knitto    15.1    15.1     %           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            &           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            '           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            (           1262    31865    Knitto    DATABASE        CREATE DATABASE "Knitto" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE "Knitto";
                postgres    false                        3079    31896 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            )           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            �            1259    31907    orders    TABLE     �  CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    product_ids uuid[] NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    is_paid boolean DEFAULT false NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.orders;
       public         heap    postgres    false    2            �            1259    31994    product_running_number_seq    SEQUENCE     �   CREATE SEQUENCE public.product_running_number_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.product_running_number_seq;
       public          postgres    false            �            1259    31972    products    TABLE     t  CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    price numeric(10,2) DEFAULT 0.00 NOT NULL,
    quantity integer NOT NULL,
    color character varying(255) NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    kode character varying(255),
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT products_quantity_check CHECK ((quantity >= 0))
);
    DROP TABLE public.products;
       public         heap    postgres    false    2            �            1259    31946    users    TABLE     �  CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    2                      0    31907    orders 
   TABLE DATA           g   COPY public.orders (id, user_id, product_ids, date, is_paid, meta, created_at, updated_at) FROM stdin;
    public          postgres    false    215   �       !          0    31972    products 
   TABLE DATA           u   COPY public.products (id, name, description, price, quantity, color, meta, created_at, updated_at, kode) FROM stdin;
    public          postgres    false    217   j                  0    31946    users 
   TABLE DATA           l   COPY public.users (id, first_name, last_name, username, password, meta, created_at, updated_at) FROM stdin;
    public          postgres    false    216   �       *           0    0    product_running_number_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.product_running_number_seq', 3, true);
          public          postgres    false    218            �           2606    31919    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    215            �           2606    31985    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    217            �           2606    31956    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �           2606    31958    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    216               �  x�ݗM�G��ӿ��sԨ$�������B}�����ˤc0��{4�Lp�0����*�>�%%Wv�" 9�Z􄊹uu�>
��Rq�AI�A�.v/��;�P`�aGa��D �co9���aGH��Lt�|@Z2�ݶ{�w}{|���������g-�t~*�My�s���A�q^O����<�|Z������a}�e�ü*��������/Ǵ����g+�~�K��q=��?��j<�_����<�b;���C�:�l�7�ߎ�/1���O�z���^����i�1��k"��	j|kl�FS�7d�tY��{`��L��H�ƈ��BMՁ�R���@[��pK�l�%��`�b&y
>\���]�22�\-�k1�Q�1��%I�.ݒy:-)�G��^}HrE�h��1hM��ȣP�Ct�B�!s�svt�?�B��2�\�b�!� ��$����C�Ѳ�Uό�d��Y���=01cH!_�&.�z��bR�s7�H�FwhjV�#��1gZ��䟼��_aRVr�P�VʑjSYXz*��Y��	�0_Dk��9�ϼ$#��i2���ޡ����8sM	zo�ne���*Ұ�
,�~��N�<j� Ċ_��{
�	s3���W���R�V���*Ƽ��ξ�"^���2��|/��Q�pE�0)u�d�c�܆��@	AC�)]DI�vJ�v�rp���8��<�d�0��W��e�� ���      !   Z  x�œOo�0���O�Y��؎sl� b��T�g�m�'KU*�;�B[�RU���~c�7��j_
-�� H��&��(
���D��'Xo�4���2i�uGE�i�	ƃ�W�3��Q�'v��o�����by�'J��损ǖߙ�Ap�����e�fUQZ��t~�����:�P���\M����r�ّ����u���~,|��>��;�*3�{^�.��맛U���L��!��)���kϕ���RJr��*����Z4[��M�ǑF�����(Lm��� �ü��j�|�Co~Af����"ݐ�n6�n^2v����x�"" �J�6W;��U��{�;J#{�n��e�<�"����7Ÿ2��3���l�N�{�<�:囚�'펞	l
�%[q�*EiP���o�C��"��l��Q����!��q�p+�������7>���a����>�
U��=>;�	������#�5QG'�������(%c��5.���pe���<%����cyM��� �Gr��ɠ��fg���İe��k�m��Mq��2!$[��WJ���F����0_$�!�O����V�U9{�f��.;_-��Ej�          �   x�}ɻ�0 й�
�6��Rh�T�`>Bb�T4.��/p;��q��p5V�hP�&�(,�^��"��ib���?$�23��Ij��:X�Gw�u�9B+�GtK�z��v}��`��׃O���F@�@�h+(+�$�.�)~���/j-)     