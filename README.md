# TALENT THREAD

## Projet : développement d'une application web de recrutement 

Cette application web a été réalisée dans le cadre du projet de l'UV AI16, enseignée à l'Université de Technologie de Compiègne (UTC). Elle a pour objectif d'être une plateforme numérique de recrutement, faisant le lien entre les organisations à la recherche de candidats et les personnes en quête d'emploi. 

## Structure du GIT

Le dépôt git comporte plusieurs dossiers : 
1. "Conception" : comporte les livrables du TD1, à savoir : 
    - Diagramme des cas d'utilisation - diagramme_cas_utilisation.png
    - Carte de navigation - carte_de_navigation.png
    - UML/MLD - UML.png & MLD.txt
    - Scripts de création et alimentation des BDD - code_creation_alimentation_BDD.sql 
    - Maquette du site - Maquette_IHM.pdf
2. "HTML, CSS" : comporte les pages statiques initiales, qui ont été remplacées par la suite par des vues dynamiques
3. "Tailwind" : correspond à une amélioration du CSS des pages du dossier précédent
4. "myapp" : comporte tous les composants de l'application (code) 
5. Le reste des documents correspondent aux dossiers/fichiers de gestion des bibliothèques, modules et dépendances. 

Rq: Une partie du CSS (post- tailwind) a été généré par une IA.

## Architecture

Cette application 'app.js' se base sur une structure MVC - Modèle, Vue, Controleur - d'Express, et sépare l'application en trois composants interconnectés. L'objectif a été d'organiser notre code de manière à ce qu'il soit modulaire et maintenable. 
1. Modèle : Le modèle gère les données et la logique métier de l'application. Il est connecté à la base de données qu'il interroge et met à jour. 
    - Disponible dans le dossier "model"
    - Chaque fichier correspond aux opérations CRUD de gestion d'une table de la base de données.

2. Vue :  La vue est responsable de la présentation des données. Elle génère l'interface utilisateur en se basant sur les données fournies par le modèle. Toutes les pages de cette application sont des vues dynamiques. 
    - Disponible dans le dossier "views"
    - Chaque fichier correspond à une page distincte d'affichage.

3. Contrôleur :  Le contrôleur gère les interactions entre le modèle et la vue. Il reçoit les entrées de l'utilisateur via la vue, traite ces entrées (souvent en interagissant avec le modèle), et renvoie une réponse appropriée à la vue. Dans notre application, le contrôleur correspond aux routes.
    - Disponible dans le dossier "routes"
    - Chaque fichier correspond à la fonction/type d'utilisateur qui va y accéder. 

Une structure de gestion de session figure enfin à la racine permettant de garantir à chacun une utilisation optimale du site. 

La base de données est hébergée sur le serveur de l'UTC au nom de : sr10p043. Le mot de passe est celui fourni au début du semestre. 

## Lancement

L'application se lance avec Node.js en exécutant la commande suivante : node myapp/app.js . 
Par ailleurs, il faut préalablement installer le package dotenv : 'npm install express dotenv'. On crée ensuite un fichier '.env' à la racine de myapp dans lequel on copie le contenu ci-dessous qui permet la connexion à la base de données: 

DB_HOST=tuxa.sme.utc   
DB_USER=sr10p043  
DB_PASSWORD=************  
DB_NAME=sr10p043  

En effet, le .env n'est pas disponible sur git, il faut le créer localement (contient les informations de connexion à la base de données => indisponible sur git pour des raisons de sécurité). 

Le lancement du site est prévu pour rediriger vers la page d'accueil d'un visiteur, qui propose soit de se connecter soit de s'inscrire. Lors de la connexion, le site redirige l'accueil en fonction du type de compte que l'utilisateur dispose: administrateur ou candidat. S'il est recruteur, il pourra se connecter sur son espace 'Recruteur' via sa page d'accueil candidat. 

## Fonctionnalités

Les fonctionnalités principales sont: 
- Ajouter une organisation (entreprise, association ou toute entité qui recrute)
- Ajouter des offres (+ éditer et supprimer une offre)
- Lister les offres (+ ajouter des filtres sur la liste)
- Chercher une offre par lieu, titre, type de poste, etc.
- Candidater à une offre
- Afficher la liste des candidats à une offre
- Télécharger les dossiers des candidats

Le reste des fonctionnalités sont décrites dans le diagramme des utilisations et dans la carte de navigation.

Remarque : Nous avons mis à jour depuis la soutenance l'application, en ajoutant la fonctionnalité de désactivation d'un utilisateur du côté administrateur. Celle-ci est disponible via la vue "Manage Users". 

## Aspect sécurité 

Cette application a été conçue pour être sécurisée et garantir la protection des données des utilisateurs. 
Plusieurs volets de sécurité ont été mis en place, les vulnérabilités sont présentés ci-dessous :

### Gestion de l'authentification

1. Hashage de mots de passe : sécuriser l'accès aux comptes en cryptant les mots de passe dans la base de données (utilisation d'un algorithme de hachage fort, 'bcrypt'). Aucun mot de passe n'est inscrit dans le code ou dans la base de données. Il existe une fonction pour décrypter un mot de passe en cas de besoin. 
- Exemple d'attaque :  Attaque par force brute sur des mots de passe en clair dans la base de données. En utilisant le hachage, même si la base de données est compromise, les mots de passe ne peuvent pas être directement utilisés.
2. Mise en place d'un captcha : vérifier si la personne essayant de se connecter est un humain ou une application tierce
- Exemple d'attaque : Attaque par bot automatisé essayant de deviner les identifiants de connexion. Le captcha empêche les bots d'exécuter de multiples tentatives de connexion.
3. Mise en place de vérifications : s'assurer de la robustesse des mots de passe lors de l'incription - selon les réglementations de la CNIL 
- Exemple d'attaque : Utilisation de mots de passe faibles ou courants qui peuvent être facilement devinés ou craqués. La vérification de la robustesse empêche l'utilisation de mots de passe faibles.

### Gestion des sessions

1. Session temporaire : mise en place d'un mécanisme de session pour chaque compte 
- Exemple d'attaque : Hijacking de session où un attaquant vole l'identifiant de session pour usurper l'identité de l'utilisateur. Les sessions temporaires limitent la durée pendant laquelle une session volée est utile.
2. Session active : mise en place d'un système de déconnexion au bout de 30 minutes d'inactivité
- Exemple d'attaque : Session fixation où un attaquant maintient une session active pour abuser des droits de l'utilisateur. La déconnexion automatique réduit la fenêtre de temps durant laquelle une session inactive peut être exploitée.
3. Protection de l'ID de session : utilisation du HTTPOnly
- Exemple d'attaque : Attaque par script intersite (XSS) où un attaquant vole l'identifiant de session via un script malveillant. Le HTTPOnly empêche les scripts côté client d'accéder aux cookies de session.
4. Protection des routes : interdiction d'accès aux routes concernant un type de compte autre que le sien 
- Exemple d'attaque : Escalade de privilèges où un utilisateur non autorisé accède à des fonctionnalités réservées à un autre type de compte. La protection des routes garantit que chaque utilisateur ne peut accéder qu'aux fonctionnalités pertinentes pour son rôle.

### Minimiser le risque d'injection 

1. SQL prepared statement : utilisation de requêtes préparées, séparant la logique de la requête SQL de ses paramètres en utilisant des espaces réservés
- Exemple d'attaque : Injection SQL où des attaquants insèrent des commandes SQL malveillantes via des entrées utilisateur. Les requêtes préparées empêchent l'exécution de code SQL non prévu.
2. Validation des entrées : contrôle des types et de l'intégrité des données entrées dans les formulaires avant l'enregistrement dans la base de données 
- Exemple d'attaque : Attaque par dépassement de tampon où un attaquant tente de soumettre une entrée anormalement longue pour déborder le stockage alloué, potentiellement écrasant des données adjacentes ou exécutant du code malveillant. La validation des entrées peut imposer des limites de longueur strictes pour prévenir ce type d'attaque.
3. Droit d'accès sur la base de données réduit : seuls les administrateurs ont des privilèges de modification ou d'affichage de certaines données de la base de donnée. Les comptes candidats et recruteurs se contentent de se voir afficher les données qui les concernent. Cependant, aucun compte ne permet l'accès à des zones critiques de la base de données, comme la modification de sa structure. Celle-ci n'est accessible qu'à travers le compte dédié, déjà soumis à certaines restrictions par l'administrateur de la base de données.
- Exemple d'attaque : Escalade de privilèges où un utilisateur non autorisé modifie des données critiques ou la structure de la base de données. La restriction des privilèges garantit que seuls les utilisateurs autorisés peuvent effectuer des modifications critiques.

## Contribution

Projet académique réalisé dans le cadre de l'UV AI16 à l'Université de Technologie de Compiègne. **Juin 2024**

2 membres : 
- **Imene Benyagoub**
- **Yousra Hassan**