link method2 select/query
https://sequelize.org/api/v6/class/src/model.js~model

link alter table
https://sequelize.org/api/v6/class/src/dialects/abstract/query-interface.js~queryinterface


SET UP FOLDER & FILES

1. Masuk folder yg diclone, buat branch
    git checkout -b avinska

2. PINDAH FOLDER
	cd <nama_folder>

3. Initialize npm 
    npm init -y

4. Buat gitignore
    touch .gitignore 
    echo node_modules/ >> .gitignore

5. Install packages 
    npm i pg express ejs sequelize

6. sequelize init (KALO GA BISA LANGSUNG PAKE NPX AJA)

7. Isi file config/config.json (dev stage aja), sesuain sama device kita. habis itu create database pake sequelize
	sequelize db:create

8. Generate model (perhatiin spasi, datatype kalo varchar jadi string) inget id, createdat dan updatedat gausahhh
sequelize model:generate --name User --attributes email:string,username:string,role:string,password:string
sequelize model:generate --name Tweet --attributes tweet:string,imageURL:string
sequelize model:generate --name Profile --attributes firstName:string,lastName:string,imageURL:string,dateOfBirth:date,location:string
sequelize model:generate --name Mutuals --attributes UserId:string,MutualId:string

9. Jalanin migrasi untuk create tablenya. inget behavior migrasi: jalanin yang belum dijalanin
    sequelize db:migrate 

untuk undo misal data keseed dobel
    sequelize db:migrate:undo:all <all utk semua, tanpa all balik ke migrasi terakhir, behaviornya kyk git add git reset>

IN CASE OF ADA BIKIN COLUMN TAMBAHAN/ADD FOREIGN KEY
sequelize migration:create --name add-column-to-<nama_table>
sequelize migration:create --name add-FK-to-<nama_table>

case add fk:
3rd is options obj., isinya type (data_type), references isinya model-nya = nama_table (string), terus key-nya apa di table itu (PKnya di table one, 'id' sih hrsnya), sm terakhir onupdate/ondelete bebas. kalo otm kayanya onupdate aja yg dicascade. jgn lupa dimigrate lg

bikin asosiasi di semua model scr manual:
https://sequelize.org/docs/v6/core-concepts/assocs/#:~:text=Foo.hasOne(Bar%2C%20%7B%0A%20%20foreignKey%3A%20%27myFooId%27%0A%7D)%3B
INGET KALO FOREIGNKEYNYA CUSTOM (GK PASCALCASE) HARUS DISTATE EXPLICITLY. BIAR AMAN MASUKIN AJA OPTIONS ISI OBJECT ISI FKNYA. INGET INI KAN DI MODEL, DUE TO CIRCULAR2 IMPORT ITU JADI PAKE models.NamaModel buat manggil modelnya yaa. TP KL MAU INCLUDE DI STATIS for some reason pakenya sequelize.models.Model

===== JANLUP UPDATE ERD DAN KOLOM TABLENYA PAS MODEL INIT!! ======

10. Generate file seeder, ambil data dari JSON pake FS, trs diparse. jangan lupa samain propertinya sama attributes model. kalo ada yang beda diganti, yang lama dihapus. tambahin updatedAt dan createdAt, gampangan pake forEach drpd pake map, gausah return2.
    sequelize seed:generate --name seed-<nama_table_seed>

11. Jalanin seeder, inget behavior seed: jalanin semua dari awal kalo pake all. kalo utk banyak table, mau ngetes data, bisa pake node seeders/seed.js aja, tapi file yg diconsole.log di luar functionnya yaa. SEMUA ASYNC DIAPUS, JADI DIRETURN AJA.
    sequelize db:seed:all 

12. DONE. CEK DI BEAVER. Buat ERD (kalo disuruh, most likely disuruh)

13. JANGAN LUPA SEMUA ASYNCNYA DIAPUSSSS, DIGANTI RETURN 

14. Utk menggunakan model yang telah di generate oleh sequelize, bisa di require index dari folder model lalu diikuti dengan nama modelnya, didestruct.

15. UPDATE MODEL MANUAL dan ERD!!!! FOREIGN KEY DIUPDATE DI MODEL MANUAL, CUKUP TYPENYA AJA



MANTEP. setup beres skrg masuk ke controller.
1. buat folder2 dan file yg diperluin dan pindahin ke folder2 yg sesuai
mkdir controllers views helpers
touch app.js controller.js 

2. setup di app.js https://expressjs.com/en/starter/hello-world.html. SET VIEW ENGINE DAN USE BODYPARSER!!

3. BUAT ROUTING DAN HANDLERNYA (dpt point kalo ga balikin cannot get blabla min res send)

4. di controller.js, import model2 dari models/index.js. INDEX YA. DIDESTRUCT DAIR OBJECT. import juga Op, most likely dibutuhin. BUAT SKELETON CLASS CONSTRUCTOR, LANGSUNG EXPORT. IMPORT Controller di app. 

5. KERJAIN 1 ROUTE SMP BERES. PASTIIN TIAP .THEN ADA .CATCH DULU. BUAT SOAL2 SELANJUTNYA COPAS AJA DARI SINI, NGERI LUPA .CATCH (DI 0 IN MAU GA HAH)



Catatan2 tambahan:
1. seeding
- kalo data cuma diksh buat 1 table, isi aja manual dr beaver. utk properti2 kyk createdAt sm updatedAt (or other date column) bisa pake now() diisi di kolom beavernya.
- enakan gausa isi sih, ntar aja sekalian ngetes form add. tp just in case butuh balik ke point 1. 
2. Validation: https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/#validators
- cek range pake min sm max yaa, bukan pake len wkwk len mahh string length dudul
- inget select options dan radio button kalo gak diisi balikannya undefined, jadi kita validatenya pake notNull. kalo notNull dipasang, harus pasang allowNull:false juga di luar validate. selain itu (text, date, number) bakal balikin string kosong. jadi ceknya pake notEmpty. biar aman pake dua2nya aja.
- tambahin custom msg
- misal ada yang mau digenerate baru pas di hook beforeCreate, jangan dibuat validasi cek input kosong. karena validasi terjadi sebelum create (kyk case yg di betamart). kecuali case kyk SLC kemarin, yg isbn sebenernya udh diisi juga di awal cm later kt buat hook untuk reassign valuenya, ttp dikasih validasi input kosong. 
- cara cek properti lain, bisa pake 'this' keyword.
- biasanya ada di method post buat route add sm edit. handle errornya pertama dicek dulu namenya SequelizeValidateError bukan, kalo iya olah dulu baru di res.send. ELSE res.send err normal. HARUS PAKE ELSE YAA KRN KT GK RETURN. mungkin bisa return redirect.. nvm
- destruct dari .errors, dimap balikin .messagenya aja. clg dulu just to be safe
- RES.SEND AJA ERRORNYAAA, jgn sokide kecuali waktunya berlebih. okok
- ONLY PROCEED KALO ADA EXTRA TIME. CARA RENDER ERROR: hardcode req.query di path redirect, extract querynya di page yg diredirect. buat kondisi (ternary aja) kalo querynya undefined, kasih string kosong biar ga error pas dirender. tambahin jadi variable yg dirender di page tsb 


3. Hooks: https://sequelize.org/docs/v6/other-topics/hooks/#:~:text=User.beforeCreate(async%20(user%2C%20options)%20%3D%3E%20%7B%0A%20%20const%20hashedPassword%20%3D%20await%20hashPassword(user.password)%3B%0A%20%20user.password%20%3D%20hashedPassword%3B%0A%7D)%3B%0A%0AUser.afterValidate(%27myHookAfter%27%2C%20(user%2C%20options)%20%3D%3E%20%7B%0A%20%20user.username%20%3D%20%27Toni%27%3B%0A%7D)%3B
- gaboleh pake 'this', jadi kita pass in 2nd parameter (bebas, nama model aja camelCase), terus bisa akses pake itu misal (value, user) user.dateOfBirth gitu lah
- pake cara 3 aja plg gampil ok. taro setelah (dan di luar) init

4. Add & Edit
- INPUT WAJIB DIDESTRUCT SATU2 KOLOMNYA!!! KALO GA MINUS 10 HAYO!!!
- buat render page edit, bisa buat getter utk input datenya. bisa pake toISOString() terus dislice smp 10 kalo ga salah
- jgn lupa buat select options, buat 1 option yg selected disabled tanpa attribute value buat placeholder
- buat radio button, pake checked attribute buat di edit form

5. Helper
- knp pake helper? krn misal bikin getter, trs getternya dipake di byk model, nnti bakal jadi redundant. jadi bisa pake helper aja 
- buat folder helpers trs buat file js sesuai nama function dan diexport.
- DIPAKE LANGSUNG DARI VIEWS (EJS), YG DIRQR DI CONTROLLER YG HANDLE RENDER PAGENYA, jgn lupa dipass pas ngerender pagenya as variable aja jgn diinvoke, yg nginvoke paps di viewsnya.

6. Search/filter
- buat anchor tag kl misal button aja, hrefnya dihardcode jd nama query. trs dihandle di controller yg get pagenya
- kalo search by keyword buat form isinya input, trs sama actionnya ke page mana, METHODNYA GET biar jadi req.query
- ==== CEK KONDISI DULU === ada gak tu keyword/queryfilter, baru di add ke optionsnya. bisa 2 cara:
- pake spread ala radhea, di awal udh didefine kondisi where yg default, baru ditambahin querynya. 
- atau bisa awalnya udh object isi where obj kosong. tambahin manual kondisi filternya, trs kondisi where yg default ditambahin paling akhir. 
CONSOLE.LOG TO MAKE SURE UDH BENER OPTIONNYA

7. include
- kalo di model, harus pake sequelize.models.Model, kl jd object keynya model (gpk s). kalo di controller krn kt rqr modelnya, bisa lgsg aja pass in nama modelnya.
- inget OTM kalo diinclude/join TERGANTUNG MANA YG JD LEFTNYA. jadi hasilnya bisa beda. kalo manynya yang di kiri, onenya bakal bentuk object. kalo kebalikannya, manynya bakal bentuk array (THEREFORE KEYNYA HARUSNYA PLURAL. INGET2 PAS NGAKSES)

8. delete
kalo mau delete data tp ngirim balikan data apa yg didelete, bisa find pake pk dulu. save datanya somewhere (global var, obj mostly), trs baru di dlm .then yg dieturn delete. trs bisa kirim via res.redirect dihardcode req.querynya

9. KALO ADA DUA ID DI REQ PARAMS, PASTIIN PAS DIAMBIL DI CONTROLLER (NGEDESTRUCT) BENER YA. CASE KEMAREN KYK ADA STOREID SAMA EMPLOYEEID.

10. ROUTE DETAIL ID AJA SELALU DI AKHIR JUST TO BE SAFE. sbnrnya kl idnya di akhir (stlh method add, update, delete dsb) aman aja sih ga bakal nyangkut kesitu


11. DESTRUCT2AN SERING SALAH BOO :(, KALO COPAS FORM INPUT PERHATIIN NAMENYA LOOOOOHHHHH

12. SELECT OPTIONS KL PILHANNYA BIKIN DARI DATABASE, NAMENYA PAKE NAMA FK, VALUENYA PAKE ID, OPTIONSNYA PAKE NAMENYA (CASE AUTHOR DI FORM ADD BOOK)


13. KALO MAU Delete atau apa yg balikin notif, FINDBYPK DULUUUUU BUAT BALIKAN DATANYA. JGN ;UPA DISTORE KE GLOBAL VARIABLE BIAR BISA DI DAPET DI THE NEXT .THEN. deletenya baru di .then direturnnyaaa, JGN NESTED THEN INGET YAAAAAA WOYYYYY JGN ADA NESTED THEN/PROMISE SIPPO SIPPOOOO MINUS 10 


14. CASE FIND BY POSITION KMRN, BUAT STATIC DI MODEL, FINDALLNYA MASUKIN SINI AJA BESERTA DEFAULT2 KONDISINYA

15. SEARCH JGN LUPA PAKE ILIKE DAN PAKE %%%%%%


rupiah formatter, JGN LUPA MASUKIN 2 DI minimumFractionDigits
https://sekolahkoding.com/forum/membuat-format-rupiah-di-js-1592876607#:~:text=//%20ES6%20Javascript%0A%0Aconst%20formatRupiah%20%3D%20(money)%20%3D%3E%20%7B%0A%20%20%20return%20new%20Intl.NumberFormat(%27id%2DID%27%2C%0A%20%20%20%20%20%7B%20style%3A%20%27currency%27%2C%20currency%3A%20%27IDR%27%2C%20minimumFractionDigits%3A%200%20%7D%0A%20%20%20).format(money)%3B%0A%7D