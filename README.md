# MultipliX - Capstone Project
MultipliX is a website that allows users to customize mental math tests and compete with others. This takes inspiration from the example of answering a math question used to demonstrate React in lecture ___ and from the website MonkeyType, which allows users to customize their experience and their typing tests. Websites that allow you to test mental math ability tend to be simpler and not as advanced as ___

## Distinctiveness and Complexity
There are five HTML templates, index(for test settings, test, and result), leaderboard(to display all leaderboards), login, profile, and info.

The index page uses JavaScript to load the setting, start, and result "pages". 

The settings page is loaded by default with the default options selected, and allows users to toggle which operations they want to use(users can only toggle addition and multiplication, but subtraction and division are included with each, respectively), the correlating range of values they want to use with those operations, and the time of the test. Users are prevented from entering invalid input with JavaScript limiting the length of input on the number fields depending on the operation(max length 4 for addition and 3 for multiplication), and JavaScript prevents both addition and multiplication from being toggled off at the same time. 

When the user presses the "Enter" key or the button on the screen, the test begins, a counter starts, and an input field with autofocus shows up. The counter feature is implemented by adding a count element and a count increment into the state of a function. Using JavaScript, a random equation is generating depending on the settings the user specified. When the correct answer is typed, the question refreshes and the score updates. If a user presses the "Escape" key or the corresponding button, the test will end and the settings page will be displayed again, where they can start another test. 

After the counter runs out and the test is finished, the results page is displayed. The results page displays the user's raw score, QPM based on the time of the test, and information about the user's average time to answer questions of different operations if applicable. If the user's QPM is a personal best, either overall, or for a specific category of test(based on time, 30s, 60s, 120s, 180s), or if the user's score earned them a place on one of the leaderboards(also based on time and overall), a message will be displayed. From the results page, the user can click "Enter" to begin another test with the same settings they just played with.

The leaderboard page displays one of five leaderboards(overall QPM, QPM on 30s, 60s, 120s, 180s). The leaderboard page incorporates Django's pagination feature. By default, the leaderboard page returns page 1 of the overall leaderboard, and users can visit any leaderboard from any page of another leaderboard. 

The leaderboard page also features animation of the page buttons and of leaderboard entries that is responsive. When a page button to the right is clicked, the page buttons update and load in from the right. When a page button to the left is clicked, the buttons load in from the left. Similarly, when clicking on a page to the right, a next page, the leaderboard entries are animated from the right, and when clicking on a page to the left, a previous page, the entries are animated from the left. These animations incorporate promises so that each individual item can be loaded after the previous one, creating a visual cascading effect. When leaderboards are first loaded(from another leaderboard and not from a different page of the same leaderboard), the entries do not load in from either side but load straight down. Thus, when returning to page 1 after browsing a leaderboard, the leaderboard entries will still load from the left. Users can also click on leaderboard entries to be redirected to that user's profile.

The login page uses Bootstrap validation and Javascript to provide responsive feedback. The login page has both the register and login forms. By default, both buttons are disabled. 

For the login form, once both inputs are not empty, the button will undisable. 

For the register form, the username field has to be non empty, the email field has to include '@', the password must be at least 8 characters, and the confirm password field must must a valid password. All of this must be accomplished, and is indicated by Bootstrap's valid form, before the register button can be clicked. Using JavaScript, an appropriate message will display, and the message is changed whenever a different input is selected and focused. For example, when typing in the username field, the max length is 16, and a message displaying how many characters the user has left is displayed and updated with every key click. 

The profile page will show differently depending on whether it is the user's profile. The profile page displays personal bests, total time played, total tests taken, and the date joined. 

The info page is basic information. 

All pages have a responsive footer. If the window is large enough, the footer will automatically be placed under the display window, so it will not be visible unless the user scrolls. If the window is too small, then the footer will stay under the content. When the window is expanded, the footer sticks to the bottom and will return back to where it was first loaded in based on the window size. If content is collapsed and the length of the content changes, the footer changes it's set position. 

In terms of complexity on the backend with models, my project uses Profile, Leaderboard, and Test models. 

A Test object is created everytime a user starts a test , including information about the duration of test, the test settings/options, and whether the test has default settings. When this is called, all Test objects without a user associated are deleted. Once a test is finished and the user is logged in, a "PUT" request is made, providing information about a user's QPM, questions per minute, which is how scores are measured. This data is then used to update a user's personal bests and update the leaderboards(if applicable).

Five Leaderboard objects are created (overall, 30s, 60s, 120s, 180s) at the beginning of the views.py file if they do not already exist. Leaderboard has a ManyToMany relationship with Test. Whenever a test is finished, if the test falls into the leaderboard category and the leaderboard is not at its maximum length, it will automatically add test. If the leaderboard is full, it will compare it to the minimum value, and if the test's QPM is greater, `replace_leaderboard` is called. This finds the test that the minimum value belonged to, removes that test, deletes the test, and adds the next test. Then, `order_leaderboard(..., "replace")` is called, which turns the QuerySet of Test objects into an array of dictionaries, which is then reverse indexed into descending order based on QPM, and since "replace" was passed as a parameter, the minimum value of the leaderboard will be updated based on this ordering. This is the same method that returns an ordered array to display leaderboards.

Profile objects are created whenever a User is created. Profile is updated whenever a user finishes a test.

## How to Run

## Files

### templates/

### static/


Features 

Responsive
    - Settings page
        - Disabling Addition or Multiplication disables their unput fields
        - Prevents user from unchecking both options

    - Login/Register Page
        - Login and Register buttons disabled until all fields are valid
            - For Login this means that both pages are not empty
        - Register page checks that inputs are valid and displays messages about input validity
