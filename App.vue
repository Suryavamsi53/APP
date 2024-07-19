<template>
  <div class="container">
    <header>
      <h1>Data Driven UI</h1>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/databases">Databases</router-link></li>
        </ul>
      </nav>
    </header>

    <main>
      <router-view />
      <!-- Use the Contact component here if necessary -->
      <!-- <Contact /> -->
    </main>

    <footer>
      <p>&copy; 2023 Data Driven UI</p>
    </footer>
  </div>
  <databases></databases>
</template>

<script>
import Databases from './components/databases.vue';

export default {
  name: 'App',
  
  components: {
     Databases

}}
</script>


<style scoped>
.container {
  font-family: sans-serif;
  background-color: #f5f5f5;
  color: #333;
  padding: 20px;
  margin-bottom: 50px; /* added margin to make room for fixed footer */
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  margin-top: 50px;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between; /* added to distribute nav items evenly */
}

nav li {
  margin-right: 20px; /* reduced margin to make nav items closer */
}

nav a {
  text-decoration: none;
  color: #333;
}

main {
  padding: 20px;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0; /* added this line */
  width: 100%;
  text-align: center;
  padding: 10px;
  background-color: #f5f5f5;
  color: #333;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>
