<div align="center">
  <img src="https://64.media.tumblr.com/49e69180ac95f134f64108417e43895f/bd71ea01d76a1a96-a8/s540x810/5cdc49aca5f4029c6b73bcea6f142f21fe6ad08a.gif" alt="MasterHead">
</div>
<h1 style="font-weight: bold" align="center">FinnaOrganize: Finance Tracker Web App</h1>
<h3 align="center">A final project for the online course Harvard CS50x 2023 - 2024. </h3>
<h3 style="font-weight: bold" align="center">Video Demo: [URL HERE]</h3>

<h1>Entity Relationship Diagram</h1>
<img src="https://i.imgur.com/QqahbwK.png" alt="FinnaOrganize Database">
<p>
    An entity-relationship diagram was established to fully visualize and synthesize the database of the system. An ERD is important in a finance tracking system because it helps to identify the key entities involved, such as users, transactions, budgets, and goals, along with their relationships and attributes. By mapping out these elements, an ERD facilitates better understanding and organization of the data structure, ensuring that all necessary information is captured accurately. It also aids in optimizing database design, improving data integrity, and streamlining the development process, ultimately leading to a more efficient and user-friendly application.
  <br>
  <br>
  The finances table stores each user's financial information. It includes their savings, spendings, and allowance. Each record in this table is linked to a specific user using the userID foreign key. This ensures that financial data is associated with the correct user.
  <br>
  <br>
The users table stores information about users. It includes their username, hashed password, and salt for password security. The hashed password is stored securely to prevent unauthorized access. The salt adds an extra layer of security by making it more difficult to crack the password even if the hash is compromised.
  <br>
  <br>
The transactions table stores details about financial transactions. It includes the transaction type, date, and amount. This table allows users to track their income and expenses over time. The userID foreign key links each transaction to a specific user, ensuring that transactions are associated with the correct user.
  <br>
  <br>
The goal_info table stores information about financial goals. It includes the goal name, description, total amount required, and current deposit. This table helps users set and track their financial goals. The goalID foreign key is used to link goal counts to specific goals, allowing users to track their progress towards each goal.
  <br>
  <br>
Finally, the goal_counts table tracks the progress of users towards their goals. It stores the number of times each goal has been achieved. This table allows users to see how close they are to reaching their goals and to stay motivated. The goalID and userID foreign keys link goal counts to specific goals and users, ensuring that progress is tracked accurately.
  <br>
  <br>
</p>
<h1>Tech Stack Used: </h1>
<h3>Client-Side</h3>
<div style="display:flex; justify-content: space-between; align-items: center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="50" height="50"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/800px-Bootstrap_logo.svg.png" alt="bootstrap" width="50" height="50"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1200px-Unofficial_JavaScript_logo_2.svg.png" alt="javascript" width="50" height="50"/>
</div>
<h3>Server-Side</h3>
<div style="display:flex; justify-content: space-between; align-items: center">
  <img src="https://blog.appseed.us/content/images/2023/10/cover-flask.jpg" alt="html5" width="60" height="50"/>
</div>
<h3>Database</h3>
<div style="display:flex; justify-content: space-between; align-items: center">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfV6isJpHQF1KsuubHNwevIjO4JDzwG_b-MA&s" alt="html5" width="100" height="60"/>
</div>
<br>
<p style="text-align: justify;" > Using HTML, CSS, JavaScript, Flask, and SQLite3 as a beginner tech stack is an excellent choice for this project, as is it already taught within the course. HTML provides the foundational structure of web pages, while CSS enhances their visual appeal and layout. JavaScript adds interactivity and dynamic content, making websites more engaging. Flask, a lightweight Python web framework, simplifies backend development, enabling beginners to build and manage web applications efficiently. SQLite3, a lightweight database, allows easy data storage and retrieval without the complexity of setting up a full-fledged database system. Together, these technologies create a cohesive and accessible environment for learning web development fundamentals. </p> <br>
<h1>Contact</h1>
<h3>If you encounter any bugs or have suggestions for improvements, please feel free to contact me via:</h3>
<h4>Email:</h4>
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=example@gmail.com">johnrlnd1704@gmail.com</a>
