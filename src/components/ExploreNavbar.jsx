import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';
import PropTypes from 'prop-types';

function ExploreNavbar(props) {
  const { designSlug, categoryData } = props;

  function renderCategories() {
    return categoryData.data.categories.map((item, key) => {
      return (
        <Link key={key} href={`/home-interior-design/${item.slug}`}>
          <a className={`text-nowrap fw-500 explore-link nav-link ${(designSlug == item.slug && 'active') || ''}`}>
            {item.name}
          </a>
        </Link>
      );
    });
  }

  return (
    <>
      {categoryData && (
        <div className="container-fluid inner-navbar table-responsive">
          <Navbar className="py-0 container">
            <Nav className="">
              <Link href={'/home-interior-design'}>
                <a
                  className={`text-nowrap fw-500 explore-link nav-link ${(!designSlug && 'active') || ''} ${
                    (designSlug == 'all' && 'active') || ''
                  }`}
                >
                  All Design
                </a>
              </Link>
              {renderCategories()}
            </Nav>
          </Navbar>
        </div>
      )}
    </>
  );
}

ExploreNavbar.propTypes = {
  designSlug: PropTypes.string,
  categoryData: PropTypes.object,
};

export default ExploreNavbar;
