<p align="center">
  <a href="https://www.medusajs.com">
    <img alt="Medusa" src="https://user-images.githubusercontent.com/7554214/153162406-bf8fd16f-aa98-4604-b87b-e13ab4baf604.png" width="100" />
  </a>
</p>
<h1 align="center">
  DOBTech E-Commerce
</h1>

<h4 align="center">
  <a href="https://github.com/medusajs/admin">DOBTech Website</a> |
  <a href="https://www.medusajs.com">DOBTech E-Commerce</a> |
</h4>

<p align="center">
DOBTech is an open-source headless commerce engine that enables developers to create amazing digital commerce experiences.
</p>

---

## Requirements

Ensure you have the following installed:

-   Docker

## Getting Started

-   **Step 1**: Clone the repository using **one** of these commands:

    -   If you don't have an SSH key set up:

    ```bash
    git clone https://github.com/longdx304/dobtech.git && cd dobtech
    ```

    -   If you have an SSH key set up or want to add it ([guide here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account))

    ```bash
    git clone git@github.com:longdx304/dobtech.git && cd dobtech
    ```

-   **Step 2**: Copy the `.env` files

    ```bash
    cp backend/.env.example backend/.env
    cp storefront/.env.example storefront/.env
    cp admin/.env.example admin/.env
    ```

-   **Step 5**: Launch the app

    ```bash
    docker compose up --build
    ```

    Your local setup is now running with each of the services occupying the following ports:

<ul>
  <li><b>DOBTech Server</b>: 9000
  <li><b>DOBTech Admin</b>: 7000
  <li><b>DOBTech Storefront</b>: 8000
  <li><b>postgres</b>: 5432
  <li><b>redis</b>: 6379
</ul>

### Seeding your Medusa store

To add seed data to your medusa store run this command in a seperate

```
docker exec medusa-server medusa seed -f ./data/seed.json
```

## Running Medusa with docker in production

This repository and each of the services contain dockerfiles for both development and production, named `Dockerfile` and `Dockerfile.prod` respectively. The `Dockerfile.prod` copies the local files from disk and builds a production ready image based on your local development progress. Your specific needs for a production like container might differ from the `Dockerfile.prod` but it should provide a template and an idea of the requirements for each of the basic services.

To run the services in a production state `docker compose` is simply run with the `docker-compose.production.yml` file as well as the basic `docker-compose.yml` file as seen below. If you wish to build the production ready images and then start them run `docker compose up` with the `--build` flag as described above.

```
docker compose up -f docker-compose.yml -f docker-compose.production.yml up
```

`docker-compose.production.yml` contains production relevant overrides to the services described in the `docker-compose.yml` development file.

## Try it out

```
curl -X GET localhost:9000/store/products | python -m json.tool
```

After the seed script has run you will have the following things in you database:

- a User with the email: admin@medusa-test.com and password: supersecret
- a Region called Default Region with the countries GB, DE, DK, SE, FR, ES, IT
- a Shipping Option called Standard Shipping which costs 10 EUR
- a Product called Cool Test Product with 4 Product Variants that all cost 19.50 EUR
