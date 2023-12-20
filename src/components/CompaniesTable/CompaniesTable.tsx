import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch  } from 'react-redux'
import { add, remove, edit, addMultiply } from '../../store/slices/companiesSlice.js';
import { CompaniesTableProps, Worker, Company } from 'types/types.ts';

import useEditable from '../hooks/useEditable.js';

import Checkbox from '../Checkbox/Checkbox.tsx';
import './index.scss';




function CompaniesTable({selectedCompanies, setSelectedCompanies}: CompaniesTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const companies: Array<Company> = useSelector((state: any) => state.companies.list);
  const workers: Array<Worker> = useSelector((state: any ) => state.workers.list);
  const dispatch = useDispatch();

  const editSave = useCallback((id: number, param: string, content: string) => {
    dispatch(edit({ id, param, content }))
  }, [dispatch]);

  useEditable(tableRef, editSave);

  const [allCompaniesSelected, setAllCompaniesSelected] = useState(false);

  useEffect(() => {
    setAllCompaniesSelected(selectedCompanies.length === companies.length);
  }, [companies, selectedCompanies]);

  const handleCompany = useCallback((bool: boolean, id: number) => {
    if (bool) {
      setSelectedCompanies([...selectedCompanies, +id]);
    } else {
      setSelectedCompanies(selectedCompanies.filter(c => c !== id));
    }
  }, [selectedCompanies, setSelectedCompanies]);

  const companyIsSelected = useCallback((id: number) => {
    return selectedCompanies.includes(+id);
  }, [selectedCompanies]);

  const selectAllCompanies = () => {
    if (allCompaniesSelected) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(companies.map(c => c.id));
    }
  };

  const deleteCompanies = () => {
    if (selectedCompanies.length > 0) {
      const companiesToDelete = companies.filter(f => selectedCompanies.includes(f.id));
      companiesToDelete.forEach(c => dispatch(remove(c)));
      setSelectedCompanies([]);
    }
  };

  const [isEndOfListVisible, setIsEndOfListVisible] = useState(false);

  const loadFunc = useCallback(() => {
    if (!isEndOfListVisible) {
      setIsEndOfListVisible(true);
      setTimeout(() => {
        dispatch(addMultiply(10));
        setIsEndOfListVisible(false);
      }, 1000);
    }
  }, [dispatch, isEndOfListVisible]);



  const endOfListRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadFunc();
        }
      });
    }, { threshold: 1.0 });

    const currentRef = endOfListRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadFunc]);

  const handleScroll = useCallback(() => {
    if (endOfListRef.current && endOfListRef.current.getBoundingClientRect().bottom <= window.innerHeight) {
      loadFunc();
    }
  }, [loadFunc]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className='companies-table'>
      <div className='companies-header'>
        <p className='companies-header__title'>Компании</p>
        <p className='companies-checkbox__text'>Выделить всё</p>
        <Checkbox customToggle customStatus={allCompaniesSelected} callback={selectAllCompanies} />
      </div>
      <div className='table-control'>
        <button className="table__button" onClick={() => dispatch(add())}> Добавить компанию </button>
        <button className={`table__button ${selectedCompanies.length <= 0 ? 'disabled' : ''}`} onClick={deleteCompanies}> Удалить компанию</button>
      </div>

      <div className="table title">
        <p className="table__item"> </p>
        <p className="table__item"> Название компании </p>
        <p className="table__item"> Кол-во сотрудников </p>
        <p className="table__item"> Адрес </p>
      </div>


      <div ref={tableRef} >
        { (companies.length <= 0) ? null : (
            <div className="table">
      {companies.map(company => (
        <React.Fragment key={company.id}>
          <div className="table__item" data-active={companyIsSelected(company.id)} data-id={company.id}>
            <Checkbox customToggle customStatus={companyIsSelected(company.id)} callback={(e, value) => handleCompany(value, company.id)} />
          </div>
          <p className="table__item" title={company.name} data-editable={true} data-id={company.id} data-type="name">{company.name}</p>
          <p className="table__item" style={{ textAlign: 'right' }}>{workers.filter(w => w.company === company.id).length}</p>
          <p className="table__item" title={company.address} data-editable={true} data-id={company.id} data-type="address">{company.address}</p>
        </React.Fragment>
      ))}
      <div ref={endOfListRef}>
        Загрузка...
      </div>
    </div>
          )}
      </div>

    </div>
  );
  
}

export default CompaniesTable;