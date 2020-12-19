# Projet Bibliothèque

## Fonctionnalité

bibliothécaire qui permet la gestion de location de livres.
Il voudrait que les utilisateurs s’enregistrent sur l’application pour pouvoir emprunter des
exemplaires de livres 5 au maximum sous une périodicité de 2 semaines par livre.
Un livre sera emprunté uniquement pour 2 semaines après quoi une notification de retard sera
envoyée chaque jour. Au bout de 5 relances, la capacité d’emprunter sera désactivée jusqu’à la
restitution du livre.
Le bibliothécaire a avoir une interface d’administration pour valider les inscriptions,
ajouter, modifier et supprimer des livres. Il voudrait definir des droits
différents sur l’application: les utilisateurs, ses collaborateurs, et lui-même
La connexion à l’application peut se faire en créant un
compte sur l’application.




## Pour Compiler le code sur votre machine 

Voud devez avoir installer Java, maven, jhispter, node et Angular et avec la commande :


```
mvn clean install -DskipTests (pour sauter le test)
```


### Executer le code

Tapez la commande : 


```
java -jar .\target\biblio-0.0.1-SNAPSHOT.jar 
```

Notez que vous n'avez pas besoin de compiler le code pour l'executé

