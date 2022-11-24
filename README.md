# See it, Say it API
:guard::guard::guard:

A London based community blogging website where people can view and create blog posts about all things London!

This repo contains the front send html and js files for the website. 

## Motivation

This project is part of the futureproof curriculum for LAP 1 project. We were tasked with the creation of a journals website. Our theme of a London blogging website was chosen as all collaborators are London based.  

## Installation and Usage

### Installation

- Clone or download the repo.
- This repo is connected to SISI-api repo

### Usage

- Open a html file with live server to access the website

## Technologies 

- Javascript
- HTML
- CSS
- Deployment: Netlify 

## Process

- Started with half a day planning, created Figma and Trello board
- Split up tasks into backend and frontend
    - Frontend was split up into the different webpages
- Once backend completed, all collaborated on frontend
- Connected up frontend and backend
- Deployed website
- Went through site together to identify any changes/updates needed

## Challenges and Wins

### Challenges

#### Emojis 

A challenge encountered was that user should be able to click emojis and data persist through navigation between pages, and successfully update the server​. We wanted functionality in which each emoji could only be selected once​.

To achieve the above, we had to create an object containing each emoji with values set to false. 
``` let emojiToggles = {
    like: false,
    dislike: false,
    surprise: false,
};
```
This object was then saved in local storage for access on multiple pages. Upon clicking an emoji, the respective value in the object is set to true so we could check if an emoji had been clicked. If true, no request would be made so the count remains the same. If false, the appropriate data was sent to the backend so the count could be incremented by 1.​

We managed to get the emoji count to persist throughout navigation. It took some time to decide how we were to implement the emoji functionality and how complicated we wanted it to be, so there may have been some time wasted going back and forth. With more time, we would like to include the functionality where a dislike emoji cannot be selected when a like emoji is already selected, and vise versa. 

#### GitHub :face_with_spiral_eyes:

As all relatively new users of GitHub we inevitability encountered some problems! 

We wanted to update the file structure of our project mid way through but were getting lots of conflicts that were taking time​ to resolve one by one.

As a group we helped each other resolve conflicts, ensuring that no important changes were deleted. We each updated our file structure locally and pushed to a new branch on GitHub​

Our file structures were synced (finally). In the future we would set up the file structure at the beginning etc 

### Wins

We completed the mvp to produce a good final product in a timely manner. We ensured we stayed on focus and on task by regular communication. This was also helped by spending time planning, and having a very solid foundation of an idea before we started any coding.

## Future Features 

###  Map feature 

We would like to add a map either onto the home page or as a separate page which adds the location each post is tagged to as a pin.
You would then be able to navigate around the map and select a post based on its location.

### Add own image to post

Currently a random image will be chosen and generated for the posts. 
Would like to implement the ability for post creators to upload their own image with their post

### Deselect emoji 

Would have liked to give the option to deselect an emoji.
Also not being able to select the dislike emoji when the like emoji has been selected would be a good feature.

### Homepage filters

Being able to filter the homepage by different criteria such as:
- Date
- Emoji count
- Labels 

## Contributors

@adamminchella :man_technologist:
@liambrockpy :man_technologist:
@PollyFenne :woman_technologist:
@rnba12 :man_technologist:



