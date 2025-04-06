#!/bin/bash

# Create the assets directory if it doesn't exist
mkdir -p assets

# Download header background image
curl -o assets/header-bg.jpg https://source.unsplash.com/1920x1080/?technology,code

# Download profile image
curl -o assets/profile.jpg https://source.unsplash.com/300x300/?developer,profile

# Download project images
curl -o assets/project1.jpg https://source.unsplash.com/800x600/?webdevelopment
curl -o assets/project2.jpg https://source.unsplash.com/800x600/?webapp
curl -o assets/project3.jpg https://source.unsplash.com/800x600/?mobileapp
curl -o assets/project4.jpg https://source.unsplash.com/800x600/?travel,app
curl -o assets/project5.jpg https://source.unsplash.com/800x600/?datascience
curl -o assets/project6.jpg https://source.unsplash.com/800x600/?analytics
curl -o assets/project7.jpg https://source.unsplash.com/800x600/?artificialintelligence
curl -o assets/project8.jpg https://source.unsplash.com/800x600/?machinelearning

echo "All images have been downloaded to the assets directory." 