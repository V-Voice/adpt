import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { add, remove, edit } from '../../store/slices/workersSlice';
import { Worker, WorkersTableProps } from 'types/types.ts';

import useEditable from '../hooks/useEditable';

import Checkbox from '../Checkbox/Checkbox.tsx';
import './index.scss';




function WorkersTable({ selectedCompanies }: WorkersTableProps): JSX.Element {
  const tableRef = useRef<HTMLDivElement>(null);
  const workers = useSelector((state: any) => state.workers.list);
  const companies = useSelector((state: any) => state.companies.list);
  const dispatch = useDispatch();

  const editSave = useCallback((id: number, param: string, content: string) => {
    dispatch(edit({ id, param, content }))
  }, [dispatch]);
 
  useEditable(tableRef, editSave);

  const filteredWorkers = useMemo(() => workers.filter((w: Worker) => selectedCompanies.includes(w.company)), [workers, selectedCompanies]);

  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);
  const handleWorker = (bool: boolean, id: number) => {
    setSelectedWorkers((prevSelectedWorkers: number[]) => {
      if (bool) {
        return [...prevSelectedWorkers, id];
      } else {
        return prevSelectedWorkers.filter((workerId) => workerId !== id);
      }
    });
  };

  const workerIsSelected = (id: number) => selectedWorkers.includes(id);

  const selectAllWorkers = () => {
    if (selectedWorkers.length === filteredWorkers.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(filteredWorkers.map((c) => c.id));
    }
  };

  const [allWorkersSelected, setAllWorkersSelected] = useState(false);
  useEffect(() => {
    setAllWorkersSelected(selectedWorkers.length === filteredWorkers.length);
  }, [selectedWorkers, filteredWorkers]);

  useEffect(() => {
    setSelectedWorkers((prevSelectedWorkers) => {
      return filteredWorkers
        .filter((f) => prevSelectedWorkers.includes(f.id))
        .map((w) => (selectedCompanies.includes(w.company) ? w.id : null))
        .filter(Boolean); 
    });
  }, [selectedCompanies, filteredWorkers]);

  const deleteWorkers = () => {
    if (selectedWorkers.length > 0) {
      selectedWorkers.forEach((id) => {
        const worker = filteredWorkers.find((w) => w.id === id);
        if (worker) {
          dispatch(remove(worker));
        }
      });
    }
  };

  const addWorker = () => {
    if (selectedCompanies.length > 0) {
      dispatch(add(selectedCompanies));
     
    }
  };

  return (
    <div className='workers-table'>
  
      <div className='workers-header'>
        <p className='workers-header__title'>Сотрудники</p>
  
        <p className='workers-checkbox__text'>Выделить всё</p>
        <Checkbox customToggle customStatus={allWorkersSelected} callback={selectAllWorkers} />
      </div>
      
      <div className='table-control'>
        <button className={`table__button ${companies.length <= 0 ? 'disabled' : ''}`} onClick={addWorker}> Добавить сотрудника </button>
        <button className={`table__button ${selectedWorkers.length <= 0 ? 'disabled' : ''}`} onClick={deleteWorkers}> Удалить сотрудника</button>
      </div>
  
  
      <div className="table title">
        <p className="table__item"> </p>
        <p className="table__item"> Фамилия </p>
        <p className="table__item"> Имя </p>
        <p className="table__item"> Должность </p>
      </div>
  
      <div ref={tableRef}>
        { (filteredWorkers.length <= 0) ? <h1 style={{ textAlign: 'center', marginTop: '25px' }}> Выберите компанию </h1> : (
        <div className="table">
        {
              filteredWorkers.map(worker => {
                return (
                <React.Fragment key={worker.id}>
                    <div className="table__item" data-active={workerIsSelected(worker.id)} data-id={worker.id} data-company={worker.company}> 
                      <Checkbox customToggle customStatus={workerIsSelected(worker.id)} callback={(e, value) => handleWorker(value, e.target.parentElement.dataset.id) } /> 
                    </div>
                    <p className="table__item" title={worker.name} data-id={worker.id} data-editable={true} data-type="name"> {worker.name} </p>
                    <p className="table__item" title={worker.surname} data-id={worker.id} data-editable={true} data-type="surname"> {worker.surname} </p>
                    <p className="table__item" title={worker.job} data-id={worker.id} data-editable={true} data-type="job"> {worker.job} </p>
                </React.Fragment>)
              })
            }
        </div> 
        )}
      </div>
  
    </div> 
  );
  
}

export default WorkersTable;