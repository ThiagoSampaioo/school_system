# Elévare School System

Sistema Acadêmico completo utilizando **Angular 20+ (standalone)** no frontend, **Quarkus (Java)** no backend, **Keycloak** para autenticação e **MySQL** como banco de dados.

## Tecnologias Utilizadas

### Frontend

* [Angular 20+](https://angular.io/)
* [Angular Material](https://material.angular.io/)
* [SCSS](https://sass-lang.com/)
* [CDK Layout](https://material.angular.io/cdk/layout/overview)
* [Ngx-Toastr](https://www.npmjs.com/package/ngx-toastr) (notificações)

### Backend

* [Quarkus 3.23.4](https://quarkus.io/)
* REST API com Jakarta REST (JAX-RS)
* Hibernate ORM com Panache
* MySQL Driver
* OpenAPI com Swagger UI

### Autenticação

* [Keycloak 22.0.5](https://www.keycloak.org/)

### Banco de Dados

* MySQL 8
* Adminer (interface de gerenciamento)

### Ambiente

* Docker + Docker Compose

---

## Como Rodar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/elavare-school-system.git
cd elavare-school-system
```

### 2. Subir os containers

```bash
docker-compose up -d
```

Acesso:

* Keycloak: [http://localhost:8080/](http://localhost:8080/)
* Adminer: [http://localhost:8081/](http://localhost:8081/)

  * Sistema: MySQL
  * Servidor: mysql
  * Usuário: root
  * Senha: root
  * Banco: unifor

### 3. Backend (Quarkus)

No terminal:

```bash
cd backend
./mvnw compile quarkus:dev
```

Acesso Swagger: [http://localhost:8082/q/swagger-ui](http://localhost:8082/q/swagger-ui)

### 4. Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

A aplicação estará disponível em: [http://localhost:4200/](http://localhost:4200/)

> Obs: o frontend consome a API em `http://localhost:8082/`

---
## Configuração do Keycloak

Após subir os containers com `docker-compose up -d`, acesse o painel do Keycloak:

🔗 http://localhost:8080/  
Usuário: `admin`  
Senha: `admin`

### 1. Criar um Realm

- Nome: `school-system`

### 2. Criar Clients

####  Backend (confidential)
- Client ID: `backend-api`
- Client Protocol: `openid-connect`
- Access Type: `confidential`
- Client Secret: `64wMfAsVX6kKu7dAQwfj9qA0Vx5amwa3`
- Service Accounts Enabled: 
- Standard Flow Enabled: 
- Direct Access Grants Enabled: 
- Root URL: `http://localhost:8082`

>  **Importante**: Esse client é usado para comunicação interna do Quarkus com o Keycloak (admin API).

####  Frontend (public)
- Client ID: `frontend`
- Access Type: `public`
- Standard Flow Enabled: 
- Root URL: `http://localhost:4200`

### 3. Criar as Roles

- `admin`
- `aluno`
- `professor`
- `coordenador`

### 4. Criar Usuários e Atribuir Roles

- Acesse `Users > Create user`
- Ex: `admin@elavare.com`, com role `admin` e senha `123456`
- Ative “Temporary = false” ao definir a senha

---

## 🔧 Configuração do Backend (`application.properties`)

```properties
# Banco de dados
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=root
quarkus.datasource.password=root
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3307/unifor

# Porta e logs
quarkus.http.port=8082
quarkus.log.console.level=INFO

# Swagger
quarkus.swagger-ui.always-include=true
quarkus.swagger-ui.path=/swagger-ui

# OIDC Keycloak
quarkus.oidc.auth-server-url=http://localhost:8080/realms/school-system
quarkus.oidc.client-id=backend-api
quarkus.oidc.credentials.secret=64wMfAsVX6kKu7dAQwfj9qA0Vx5amwa3
quarkus.oidc.application-type=service
quarkus.oidc.discovery-enabled=true

# Permissões
quarkus.http.auth.permission.authenticated.paths=/users/*
quarkus.http.auth.permission.authenticated.policy=authenticated

# CORS para permitir comunicação com o frontend
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:4200
quarkus.http.cors.methods=GET,PUT,POST,DELETE,OPTIONS
quarkus.http.cors.headers=Authorization,Content-Type,Accept
quarkus.http.cors.exposed-headers=Authorization,Content-Type
quarkus.http.cors.access-control-allow-credentials=true

# Keycloak Admin API (para criação de usuários)
keycloak.admin.server-url=http://localhost:8080
keycloak.admin.realm=school-system
keycloak.admin.client-id=backend-api
keycloak.admin.client-secret=64wMfAsVX6kKu7dAQwfj9qA0Vx5amwa3

```

## Funcionalidades

* Autenticação via Keycloak com roles (admin, professor, aluno, coordenador)
* CRUD de Alunos, Professores, Coordenadores
* Vínculo entre alunos e turmas
* CRUD de Cursos, Disciplinas, Turmas, Matriz Curricular
* Responsividade e animações no frontend
* Landing Page institucional com efeitos

---

## Scripts úteis

### Gerar .jar executável

```bash
./mvnw package
java -jar target/quarkus-app/quarkus-run.jar
```

### Gerar übber-jar

```bash
./mvnw package -Dquarkus.package.type=uber-jar
java -jar target/*-runner.jar
```

### Compilar nativo

```bash
./mvnw package -Dnative -Dquarkus.native.container-build=true
```

---

## Autor

Francisco Thiago Sampaio Sousa
Sistema desenvolvido como desafio técnico para a UNIFOR

---

## Screenshots
![image](https://github.com/user-attachments/assets/1de49f36-92ee-4248-a157-15c352b32783)
![image](https://github.com/user-attachments/assets/e1991569-6448-4c50-a671-d9379f3bc3f8)
![image](https://github.com/user-attachments/assets/efe5db7c-30c5-4d0c-8f28-5f9b07179585)
![image](https://github.com/user-attachments/assets/edb4eeaf-1fb9-4141-a204-bcefb7761a4d)
![image](https://github.com/user-attachments/assets/ff17c394-5e12-4347-8ff8-82411ed0d569)
![image](https://github.com/user-attachments/assets/5989a300-172e-4f0b-9e32-0fff82559a8d)
![image](https://github.com/user-attachments/assets/08e9298e-3388-4d9f-bb88-165c963ac38c)
![image](https://github.com/user-attachments/assets/4b903926-8553-438a-9908-1e911027d6b5)
![image](https://github.com/user-attachments/assets/fc878233-e687-46bc-940c-eb5aef40db29)

---

## Licença

[MIT](LICENSE)
