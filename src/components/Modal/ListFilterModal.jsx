import React, { useEffect, useState } from 'react';
import { Accordion, Modal, Nav, Tab } from 'react-bootstrap';
import { callAPI } from '_services/CallAPI';

function ListFilterModal(props) {
  const {
    closeModal,
    designSlug,
    checkMaterial,
    setCheckMaterial,
    checkCategory,
    setCheckCategory,
    checkSizes,
    setCheckSizes,
    applyFilters,
    resetPagination,
  } = props;
  const [filtersData, setFiltersData] = useState(null);
  const [filtersSizeData, setFiltersSizeData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [selectedSizeName, setSelectedSizeName] = useState(null);
  const [selectedSizeData, setSelectedSizeData] = useState(null);
  const [sizeType, setSizeType] = useState(null);
  const sizeId = checkSizes && checkSizes.map((item) => Number(item.id));
  const matId = checkMaterial && checkMaterial.map((item) => Number(item.id));
  const catId = checkCategory && checkCategory.map((item) => Number(item.id));
  useEffect(() => {
    getFiltersData();
  }, [designSlug]);

  function getFiltersData() {
    const params = {
      main_category_slug: designSlug,
    };
    callAPI('POST', process.env.DESIGNS_FILTERS_DATA, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setFiltersData(data);
      }
    });
  }

  useEffect(() => {
    checkAvailSizes();
  }, [checkMaterial, checkCategory]);

  // useEffect(() => {
  //   if (filtersSizeData?.length > 0) {
  //     applySizes(filtersSizeData?.[0].id);
  //   }
  // }, [filtersSizeData]);

  function applySizes(id, sizes) {
    setSelectedSizeName(id);
    let selectedCtg;
    if (tempData) {
      selectedCtg = tempData.find((item) => item.id == id);
    } else {
      selectedCtg = sizes.find((item) => item.id == id);
    }
    setSelectedSizeData(selectedCtg);
  }

  function filterSizes(width, height) {
    const sizes = [...selectedSizeData.sizes];
    const arr = [];
    if (width) {
      sizes.forEach((item) => {
        if (width - 2 <= item.width && width + 2 >= item.width) {
          !arr.includes(item) && arr.push(item);
        }
      });
    }
    if (height) {
      sizes.forEach((item) => {
        if (height - 2 <= item.height && height + 2 >= item.height) {
          !arr.includes(item) && arr.push(item);
        }
      });
    }
    const filteredSizes = tempData.map((item) => {
      if (item.id == selectedSizeName) {
        return { ...item, sizes: arr };
      }
      return item;
    });
    if (width || height) {
      setFiltersSizeData(filteredSizes);
    } else {
      setFiltersSizeData(tempData);
    }
  }
  function checkAvailSizes() {
    const params = {
      main_category_slug: designSlug,
      materials: matId,
      categories: catId,
    };
    callAPI('POST', process.env.DESIGNS_FILTERS_SIZE_DATA, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setFiltersSizeData(data.sizes);
        if (data.sizes[0]?.sizes?.length > 0) {
          setSizeType(data.sizes[0].sizes[0].size_type);
          applySizes(data.sizes[0]?.id, data.sizes);
        }
        setTempData(data.sizes);
        if (checkSizes.length > 0) {
          const updatedSizes = convertData(checkSizes, data.sizes);
          setCheckSizes(updatedSizes);
        }
      }
    });
  }
  const onMaterialChange = (e) => {
    const currentMatId = e.target.id;
    const currentMatNames = e.target.value;
    if (e.target.checked) {
      setCheckMaterial((prev) => [...prev, { id: currentMatId, name: currentMatNames }]);
    } else {
      const changeMaterialName = checkMaterial.filter(function (item) {
        return item.id != currentMatId;
      });
      setCheckMaterial(changeMaterialName);
    }
  };

  const onCategoryChange = (e) => {
    const currentCatId = e.target.id;
    const currentCatNames = e.target.value;
    if (e.target.checked) {
      setCheckCategory((prev) => [...prev, { id: currentCatId, name: currentCatNames }]);
    } else {
      const changeCategoryName = checkCategory.filter(function (item) {
        return item.id != currentCatId;
      });
      setCheckCategory(changeCategoryName);
    }
  };

  const onSizeChange = (e, mainCatName) => {
    const currentSizeId = e.target.id;
    const currentSizeNames = e.target.value;
    if (e.target.checked) {
      setCheckSizes((prev) => [...prev, { id: currentSizeId, name: currentSizeNames, sizeCategoryName: mainCatName }]);
    } else {
      const changeSizeName = checkSizes.filter(function (item) {
        return item.id != currentSizeId;
      });
      setCheckSizes(changeSizeName);
    }
  };

  function convertData(checkedSizeData, sizesData) {
    const dataMap = new Map();
    for (let i = 0; i < sizesData.length; i++) {
      for (let j = 0; j < sizesData[i].sizes.length; j++) {
        dataMap.set(Number(sizesData[i].sizes[j].id), true);
      }
    }
    const updatedData = checkedSizeData.filter(({ id }) => dataMap.get(Number(id)));

    return updatedData;
  }

  function getFilterSizes() {
    return filtersSizeData.map((item, key) => (
      <Accordion.Item eventKey={item.id} key={key}>
        <Accordion.Header
          onClick={() => {
            applySizes(item.id);
            setSizeType(item.sizes?.[0]?.size_type);
          }}
        >
          {item.name}
        </Accordion.Header>
        <Accordion.Body className="px-3 pt-3 pb-1">
          {(item.unit_type == 1 && (
            <div className="accordion-data d-flex align-items-center justify-content-center">
              {sizeType == 2 && (
                <>
                  <div className="input-box w-100">
                    <input
                      type="number"
                      placeholder="Length"
                      onChange={(e) => filterSizes(null, Number(e.target.value))}
                      className="fs-14 fw-500 bg-white w-100 ps-3 py-1"
                    />
                  </div>
                  <div className="text-center py-2">
                    <span className="mx-3 label-color-1">To</span>
                  </div>
                </>
              )}
              <div className="input-box w-100">
                <input
                  type="number"
                  placeholder="Width"
                  onChange={(e) => filterSizes(Number(e.target.value), null)}
                  className="fs-14 fw-500 bg-white w-100 ps-3 py-1"
                />
              </div>

              {sizeType == 1 && (
                <>
                  <div className="text-center py-2">
                    <span className="mx-3 label-color-1">To</span>
                  </div>
                  <div className="input-box w-100">
                    <input
                      type="number"
                      placeholder="Height"
                      // placeholder={(item.sizes?.length > 0 && item.sizes?.[0].size_type == 2 && 'Length') || 'Height'}
                      onChange={(e) => filterSizes(null, Number(e.target.value))}
                      className="fs-14 fw-500 bg-white w-100 ps-3 py-1"
                    />
                  </div>
                </>
              )}
            </div>
          )) ||
            ''}
          <div>
            {item.sizes.map((size, key) => (
              <div className="d-flex align-items-center filter-group-check ms-auto py-2" key={key}>
                <input
                  type="checkbox"
                  id={size.id}
                  value={`${size.name}`}
                  className="ms-auto"
                  onChange={(event) => onSizeChange(event, item.name)}
                  checked={sizeId.includes(size.id)}
                />
                <label htmlFor={size.id} className="fw-500 fs-14 label-color-1 cursor-pointer position-relative w-100">
                  {size.size_type == 2 && (
                    <>
                      {size.height &&
                        ((String(size.height).includes('.') && String(size.height).replace('.', `'`) + `"`) ||
                          size.height + `'`)}
                      {' X '}
                    </>
                  )}
                  {size.width &&
                    ((String(size.width).includes('.') && String(size.width).replace('.', `'`) + `"`) ||
                      size.width + `'`)}
                  {size.size_type != 2 && size.size_type == 1 && (
                    <>
                      {' X '}
                      {size.height &&
                        ((String(size.height).includes('.') && String(size.height).replace('.', `'`) + `"`) ||
                          size.height + `'`)}
                    </>
                  )}
                  {(item.unit_type != 1 && size.name) || ''}
                </label>
              </div>
            ))}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    ));
  }

  function resetFilters() {
    setCheckMaterial([]);
    setCheckCategory([]);
    setCheckSizes([]);
    closeModal();
    applyFilters([], [], [], true);
  }

  function filtersApply() {
    applyFilters(checkSizes, checkMaterial, checkCategory, true);
    resetPagination();
  }

  const activeFilterKey = (filtersData && filtersData.filter_orders[0].filter_key) || '';
  const activeSizeFilterKey = (filtersSizeData && filtersSizeData[0].id) || '';

  return (
    <Modal show={true} onHide={closeModal} className="list-filter-modal" centered>
      <Modal.Header>
        <span className="fw-700 heading-fonts">Filter</span>
        <button
          type="button"
          title="Close"
          className="close close-modal-btn border-0 bg-transparent label-color-6 ms-auto"
          onClick={closeModal}
          aria-label="Close"
        >
          <img src="/images/filter-close-icon.png" className="cross-icon" />
        </button>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <div className="list-filter-tabbing">
          {activeFilterKey && (
            <Tab.Container id="left-tabs-example" defaultActiveKey={activeFilterKey}>
              <div>
                <Nav variant="pills" className="d-flex">
                  {filtersData &&
                    filtersData.filter_orders.map((item, key) => (
                      <Nav.Item
                        key={key}
                        className={`${
                          (filtersData.categories?.length < 1 && item.filter_key == 'select_category' && 'd-none') || ''
                        }${
                          (filtersData.materials?.length < 1 && item.filter_key == 'select_material' && 'd-none') || ''
                        } ${
                          (filtersData.filtersSizeData?.length < 1 && item.filter_key == 'select_size' && 'd-none') ||
                          ''
                        }`}
                      >
                        <Nav.Link className="px-2 me-lg-4 me-2" eventKey={item.filter_key}>
                          {item.name}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                </Nav>
              </div>
              <div>
                <Tab.Content>
                  <Tab.Pane eventKey="select_size">
                    <div>
                      <div className="filter-size-section">
                        {activeSizeFilterKey && (
                          <Accordion defaultActiveKey={activeSizeFilterKey}>
                            {filtersSizeData && getFilterSizes()}
                          </Accordion>
                        )}
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="select_material">
                    <div className=" filter-size-section">
                      <Accordion defaultActiveKey={'0'}>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Material</Accordion.Header>
                          <Accordion.Body className="px-3 pt-3 pb-1">
                            <div>
                              {filtersData &&
                                filtersData.materials.map((item, key) => (
                                  <div className="d-flex align-items-center filter-group-check ms-auto py-2" key={key}>
                                    <input
                                      type="checkbox"
                                      value={item.name}
                                      id={item.id}
                                      className="ms-auto"
                                      onChange={onMaterialChange}
                                      checked={(checkMaterial && matId.includes(item.id)) || null}
                                    />
                                    <label
                                      htmlFor={item.id}
                                      className="fw-500 fs-14 label-color-1 cursor-pointer position-relative w-100"
                                    >
                                      {item.name}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="select_category">
                    <div className=" filter-size-section">
                      <div>
                        {filtersData &&
                          filtersData.categories.map((item, key) => (
                            <div className="" key={key}>
                              <Accordion defaultActiveKey={item.id}>
                                <Accordion.Item eventKey={item.id}>
                                  <Accordion.Header>{item.name}</Accordion.Header>
                                  <Accordion.Body className="p-0">
                                    <div>
                                      {item.child_categories &&
                                        item.child_categories.map((child, key) => (
                                          <Accordion defaultActiveKey={child.id} key={key}>
                                            <Accordion.Item eventKey={child.id} className={'bg-white'}>
                                              {child.has_levels > 0 && (
                                                <Accordion.Header className="label-color-1">
                                                  {child.name}
                                                </Accordion.Header>
                                              )}
                                              <Accordion.Body className="pe-2 ps-4 py-2 border-0">
                                                {child.has_levels == 0 && (
                                                  <div
                                                    className="d-flex align-items-center filter-group-check ms-auto py-2"
                                                    key={key}
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      id={child.id}
                                                      className="ms-auto"
                                                      value={child.name}
                                                      onChange={onCategoryChange}
                                                      checked={(checkCategory && catId.includes(child.id)) || null}
                                                    />
                                                    <label
                                                      htmlFor={child.id}
                                                      className="fw-500 fs-14 label-color-1 cursor-pointer position-relative w-100"
                                                    >
                                                      {child.name}
                                                    </label>
                                                  </div>
                                                )}
                                                {child.child_sub_categories &&
                                                  child.child_sub_categories.map((child, key) => (
                                                    <div
                                                      className="d-flex align-items-center filter-group-check ms-auto py-2"
                                                      key={key}
                                                    >
                                                      <input
                                                        type="checkbox"
                                                        id={child.id}
                                                        value={child.name}
                                                        onChange={onCategoryChange}
                                                        checked={(checkCategory && catId.includes(child.id)) || null}
                                                        className="ms-auto"
                                                      />
                                                      <label
                                                        htmlFor={child.id}
                                                        className="fw-500 fs-14 label-color-1 cursor-pointer position-relative w-100"
                                                      >
                                                        {child.name}
                                                      </label>
                                                    </div>
                                                  ))}
                                              </Accordion.Body>
                                            </Accordion.Item>
                                          </Accordion>
                                        ))}
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </div>
                          ))}
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
                <div className="pt-3 justify-content-center d-flex">
                  <button className="mx-2 reset-btn" onClick={resetFilters}>
                    Reset
                  </button>
                  <button className="blue-btn mx-2 apply-btn" onClick={filtersApply}>
                    Apply Filter
                  </button>
                </div>
              </div>
            </Tab.Container>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ListFilterModal;
