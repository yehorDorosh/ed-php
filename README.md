# Help
* Build image <br>
`$ docker build [OPTIONS] PATH_TO_DOCKER_FILE`

* [Example] Build image with name sandbox <br>
`$ docker build -t sandbox .`

* Show all images <br>
`$ docker images -a`

* Run container from image <br>
`$ docker run --name NAME_OF_CONTAINER NAME_OF_IMAGE`

* [Example] Run container with name test-container from the test-image image <br>
`$ docker run --name test-container test-image`

* [Example] Run container hello-world from built lesson1 image and mount a local directory. <br>
 `docker run -d  -p 7777:80 --rm -v /absolute/path/to/app/dir/on/host/machine:/var/www/html --name hello-world lesson1`

* Show all containers <br>
`$ docker ps -a`

* Show running / active containers <br>
`$ docker ps`

* Show running / active containers id <br>
`$ docker ps -q`

* Stop and remove all containers <br>
`$ docker stop $(docker ps -a -q)` <br>
`$ docker rm $(docker ps -a -q)`

* Delete all images <br>
`$ docker rmi $(docker images -q)`

* Remove unused data <br>
`$ docker system prune`

* Start my container <br>
`docker run -d -p 7777:80 --rm -v /Users/egor.dorosh/Documents/education/education-backend/src:/var/www/html --name education education/apache-php`

PHP 
`docker run -d -p 7777:80 --rm -v /Users/egor.dorosh/private/sites/ed-php/src:/var/www/html --name sandbox sandbox`

MYSQL
`docker run --name test-mysql -p 3306:80 -e MYSQL_ROOT_PASSWORD=123 -d mysql:latest`


Fix php error: "The server requested authentication method unknown to the client".
Where:
admin - global user
BY 'admin' - password
`ALTER USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'admin';`
or
`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';`

* Up containers <br>
`docker-compose up -d`

* Stop containers
`docker-compose down`

# DEV
* `$ docker build -t sandbox .` Only Once. Create img from docker file for "www" container
* `docker-compose up -d`
* `npm start`
*  container ed-php - mysql  `Attach shell`
*  `mysql -u root -p`
*  password `root`
*  `use main_db;`
*  `ALTER USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'admin';`

# MySQL
* Get last row from Weather table, id=1 `select * from weather where reg_date in (select max(reg_date) from weather where id='1');`
* Date period `SELECT * FROM weather WHERE id='1' AND reg_date BETWEEN '2021-11-06 20:21:36' and '2021-11-06 22:21:36'`