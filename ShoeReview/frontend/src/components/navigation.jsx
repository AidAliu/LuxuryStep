import React from "react";

export const Navigation = (props) => {
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top" style={{ minHeight: '50px' }}>
      <div className="container" 
           style={{
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'space-between',
             padding: '0'
           }}
      >
       
        <a className="navbar-brand page-scroll" href="#page-top" style={{ margin: 0, padding: '10px 0', fontWeight: '600', letterSpacing: '0.5px' }}>
          LuxuryStep
        </a>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ul className="nav navbar-nav" style={{ marginBottom: 0, display: 'flex', alignItems: 'center' }}>
            <li><a href="#features" className="page-scroll" style={{ padding: '10px 15px' }}>Features</a></li>
            <li><a href="#about" className="page-scroll" style={{ padding: '10px 15px' }}>About</a></li>
            <li><a href="#services" className="page-scroll" style={{ padding: '10px 15px' }}>Services</a></li>
            <li><a href="#portfolio" className="page-scroll" style={{ padding: '10px 15px' }}>Gallery</a></li>
            <li><a href="#contact" className="page-scroll" style={{ padding: '10px 15px' }}>Contact</a></li>
          </ul>

          <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
            <a
              href="/login"
              style={{
                textDecoration: 'none',
                color: '#333',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px 12px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              LOGIN
            </a>
            <a
              href="/register"
              style={{
                textDecoration: 'none',
                color: '#333',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px 12px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              REGISTER
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
