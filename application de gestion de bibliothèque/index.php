<?php
include 'Membre.php';


$membre = new Membre();
$membre->setFirstname("Aymane")
       ->setLastname("elhassouni")
       ->setEmail("aymaneelhassouni@gmail.com")
       ->setPassword("password");
print_r($membre);

var_dump($membre);