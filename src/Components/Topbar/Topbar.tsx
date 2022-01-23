import styles from './Topbar.module.css';
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function Topbar() {
  return (
    <>
      <Navbar
        collapseOnSelect
        fixed="top"
        expand="sm"
        bg="black"
        variant="dark"
      >
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/a">a</Nav.Link>
              <Nav.Link href="/b">b</Nav.Link>
              <Nav.Link href="/c">c</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
