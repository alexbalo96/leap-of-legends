import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Leap of Legends</h1>
      <h2 style={styles.subtitle}>Select a Level</h2>
      <div style={styles.buttonContainer}>
        <Link to="/level1">
          <button style={styles.button}>Level 1</button>
        </Link>
        <Link to="/level2">
          <button style={styles.button}>Level 2</button>
        </Link>
        <Link to="/level3">
          <button style={styles.button}>Level 3</button>
        </Link>
        <Link to="/level4">
          <button style={styles.button}>Level 4</button>
        </Link>
        <Link to="/level5">
          <button style={styles.button}>Level 5</button>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    padding: "25px",
    backgroundColor: "#f0f0f0",
    borderRadius: "20px",
    width: "100%",
    margin: "auto",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "36px",
    color: "#333",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "24px",
    color: "#666",
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "#008cba",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Home;