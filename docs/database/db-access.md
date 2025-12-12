---
layout: default
title: DB Access
parent: Database
---

# Database Access Guide

This guide outlines the steps to connect to the Swasthx databases using MongoDB Compass.

## Prerequisites

1.  **Install MongoDB Compass**: Download and install [MongoDB Compass](https://www.mongodb.com/products/tools/compass){:target="_blank"}.
2.  **IP Whitelisting**: Ensure your current IP address is whitelisted in the **Jump Server EC2** security group. Contact the infrastructure team if you need access.

## Connection Steps

Follow these steps to configure your connection:

1.  Open **MongoDB Compass** and click on **New Connection**.
2.  Click on **Advanced Connection Options**.

    ![Advanced Settings]({{ site.baseurl }}/docs/images/mongo-compass-advanced.png)

3.  **General Tab**:
    *   **Connection String Scheme**: Select `mongodb`.
    *   **Host**: Paste the connection string provided in the [https://drive.google.com/file/d/1mrfmNB1GkpEeTqFxAqc6pQgvERvH7SSu/view?usp=sharing](https://drive.google.com/file/d/1mrfmNB1GkpEeTqFxAqc6pQgvERvH7SSu/view?usp=sharing){:target="_blank"} (Host field) *(only admin can access)*.
    
4.  **Authentication Tab**:
    *   **Username**: Enter the username provided in [https://drive.google.com/file/d/1mrfmNB1GkpEeTqFxAqc6pQgvERvH7SSu/view?usp=sharing](https://drive.google.com/file/d/1mrfmNB1GkpEeTqFxAqc6pQgvERvH7SSu/view?usp=sharing){:target="_blank"} *(only admin can access)*.
    *   **Password**: Enter the password provided in [https://drive.google.com/file/d/1mrfmNB1GkpEeTqFxAqc6pQgvERvH7SSu/view?usp=sharing](https://drive.google.com/file/d/1mrfmNB1GkpEeTqFxAqc6pQgvERvH7SSu/view?usp=sharing){:target="_blank"} *(only admin can access)*.

    ![Authentication]({{ site.baseurl }}/docs/images/mongo-compass-auth.png)

5.  **TLS/SSL Tab**:
    *   **SSL/TLS Connection**: Select **Default**.
    *   **Certificate Authority**: Select the **AWS Global Certificate** file. Download it from [https://drive.google.com/file/d/1o1tiqfYWxQyxo8VI0VD7I5ooSINHWKNo/view?usp=sharing](https://drive.google.com/file/d/1o1tiqfYWxQyxo8VI0VD7I5ooSINHWKNo/view?usp=sharing){:target="_blank"} *(only admin can access)*.

    ![TLS/SSL]({{ site.baseurl }}/docs/images/mongo-compass-ssl.png)

6.  **Proxy/SSH Tab**:
    *   **Hostname**: Enter the Jump Server hostname/IP provided in [https://drive.google.com/file/d/1mrfmNB1GkpEeTqFxAqc6pQgvERvH7SSu/view?usp=sharing](https://drive.google.com/file/d/1mrfmNB1GkpEeTqFxAqc6pQgvERvH7SSu/view?usp=sharing){:target="_blank"} *(only admin can access)*.
    *   **Port**: Enter the port (usually `22`) provided in [https://drive.google.com/file/d/1mrfmNB1GkpEeTqFxAqc6pQgvERvH7SSu/view?usp=sharing](https://drive.google.com/file/d/1mrfmNB1GkpEeTqFxAqc6pQgvERvH7SSu/view?usp=sharing){:target="_blank"} *(only admin can access)*.
    *   **Identity File**: Select your `.pem` key file (e.g., `swasthxAwsKeyPair.pem`). You can get it from [https://drive.google.com/file/d/1JuMSJOzQnnMk08keiei1agxV0RBMiUDJ/view?usp=sharing](https://drive.google.com/file/d/1JuMSJOzQnnMk08keiei1agxV0RBMiUDJ/view?usp=sharing){:target="_blank"} *(only admin can access)*.

    ![Proxy/SSH]({{ site.baseurl }}/docs/images/mongo-compass-ssh.png)

    > [!IMPORTANT]
    > If you receive an authentication error regarding the `.pem` file permissions, run the following command in your terminal:
    > ```bash
    > chmod 400 "swasthxAwsKeyPair.pem"
    > ```

7.  Click **Connect**. You should now be connected to the database.
