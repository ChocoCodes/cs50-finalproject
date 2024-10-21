<div align="center">
  <img src="https://64.media.tumblr.com/49e69180ac95f134f64108417e43895f/bd71ea01d76a1a96-a8/s540x810/5cdc49aca5f4029c6b73bcea6f142f21fe6ad08a.gif" alt="MasterHead">
</div>
<h1 style="font-weight: bold" align="center">FinnaOrganize: Finance Tracker Web App</h1>
<h3 align="center">A final project for the online course Harvard CS50x 2023 - 2024. </h3>
<h3 style="font-weight: bold" align="center">Video Demo: [URL HERE]</h3>

<h1 id="intro">Introduction</h1>
<p>
  <strong>FinnaOrganize: Finance Tracking System</strong> is a web application designed to help users manage their personal finances by tracking income, expenses, and savings, while also setting and monitoring financial goals. Built with Flask for the backend and HTML, CSS, and JavaScript for the frontend, it provides a seamless and user-friendly interface. The system employs CRUD operations, allowing users to create, view, update, and delete financial records and goals, giving them full control over their data. An Entity-Relationship Diagram (ERD) is used to structure the database efficiently, ensuring data integrity and optimal performance. With real-time updates and secure data management, this application offers users the tools needed for effective financial monitoring.
</p>

<h1 id="table-of-contents">Table of Contents</h1>
<ul>
  <li><a href="#tech-stack">Technology Stack</a></li>
  <li><a href="#erd">Entity Relationship Diagram</a></li>
  <li><a href="#feat">System Features</a></li>
  <li><a href="#">System Limitations</a></li>
  <li><a href="#">How to Use</a></li>
  <li><a href="#">License</a></li>
  <li><a href="#contact">Contact</a></li>
</ul>

<h1 id="tech-stack">Technology Stack</h1>
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

<h1 id="erd">Entity Relationship Diagram</h1>
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

<h1 id="feat">System Features</h1>
<img src="https://i.imgur.com/9ARCKcA.jpeg" alt="login page"> 
<p>
  The system utilizes CRUD (Create, Read, Update, Delete) operations to provide users with a comprehensive and interactive financial management experience. Each feature of the system is designed to allow users to easily manage their financial information and goals effectively. For instance, users can create new transactions and financial goals, read their current financial summary and transaction history, update existing information, such as account settings or goals, and delete transactions or accounts when necessary, ensuring that users have full control over their financial data and personal information. This CRUD functionality is essential for fostering user engagement and facilitating efficient financial planning and management.
</p>

<h3><strong>Dashboard Page</strong></h3>
<img src="https://i.imgur.com/1R0PXuM.jpeg" alt="dashboard mockup">
<p>
<strong>Financial Summary:</strong> The financial summary provides users with a snapshot of their overall financial health at a glance. It aggregates key metrics such as total savings, total spendings, and total allowances, allowing users to quickly assess where they stand financially. This feature serves as a foundation for users to make informed decisions about their budgeting and financial planning. 
</p>
<p>
<strong>Transaction History:</strong> The transaction history feature maintains a detailed log of all past transactions categorized by type, such as savings, spendings, and allowances. Users can filter and sort this data to easily find specific entries or analyze trends over time. This historical perspective is crucial for users to understand their spending habits and to identify areas where they may need to adjust their financial behavior. 
</p>
<p>
<strong>Transaction Submission Form:</strong> The transaction submission form simplifies the process of recording new financial activities by allowing users to input details such as the amount and category of the transaction. This user-friendly interface is designed to minimize friction, encouraging users to update their financial records regularly. With a straightforward submission process, users can maintain an accurate and up-to-date representation of their finances.
</p>
<p>
<strong>Real-Time Updates:</strong> Real-time updates ensure that any new transactions submitted by the user are immediately reflected in the financial summary and transaction history. This dynamic feature eliminates the need for manual refreshing or waiting periods, enhancing the user experience by providing instant feedback on financial changes. Users can rely on this immediacy to stay informed about their current financial situation.
</p>

<h3><strong>Profile Page</strong></h3>
<img src="https://i.imgur.com/eMou1yG.jpeg" alt="profile page mockup">
<p>
<strong>Account Information Management - Edit Password or Delete Account:</strong> The account information section allows users to manage their credentials by providing options to edit their password or delete their account entirely. This functionality is crucial for maintaining user security and privacy, enabling users to update their passwords if they suspect unauthorized access or simply wish to enhance their account security. Additionally, the option to delete an account offers users control over their data, allowing them to permanently remove their information from the system if they choose to discontinue using the service.
</p>
<p>
<strong>Goal Management - Add, Edit, Delete, or Update goals through dropdown:</strong> The goal management feature provides users with an intuitive interface to add, edit, delete, or update their financial goals using a convenient dropdown menu. This functionality enables users to set clear, achievable objectives for their savings and spending, which can motivate them to reach their financial targets more effectively. By allowing users to manage their goals dynamically, the system supports a personalized approach to financial planning, making it easier for individuals to track their progress and make adjustments as necessary.
</p>

<h1 id="limits">System Limitations</h1>
<ul>
  <li>
    <strong>Unresponsive Design for Custom Components:</strong> The current system suffers from an unresponsive design, particularly in its custom components, which can lead to a suboptimal user experience on various devices. When users access the dashboard on mobile or tablet devices, the layout may not adjust appropriately, resulting in components that are difficult to navigate or read. This limitation restricts users' ability to interact with the dashboard seamlessly across different screen sizes, potentially diminishing user engagement and satisfaction.
  </li>
  <li>
    <strong>Tracking Provides Only Summary Statistics:</strong> The tracking feature of the application is limited to providing summary statistics for savings, spendings, and allowances without offering detailed insights or breakdowns. While summary statistics can give users a high-level view of their financial situation, they lack the granularity needed for in-depth analysis of spending habits or savings trends. This limitation may prevent users from fully understanding their financial behaviors, making it challenging to identify specific areas for improvement or informed decision-making.
  </li>
  <li>
    <strong>Information Displayed in Tabular Form: </strong> The dashboard displays information primarily in tabular format, which can lead to a less engaging and intuitive user experience. While tables can effectively present data, they often lack the visual appeal and interactivity that users expect from modern applications. The absence of custom interfaces, such as graphs, charts, or visual indicators, means that users may find it harder to interpret and interact with their financial data, potentially leading to disengagement or difficulty in recognizing key insights.
  </li>
</ul>

<h1 id="contact">Contact</h1>
<h3>If you encounter any bugs or have suggestions for improvements, please feel free to contact me via:</h3>
<h4>Email:</h4>
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=example@gmail.com">johnrlnd1704@gmail.com</a>
