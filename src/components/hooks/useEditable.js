/* eslint-disable eqeqeq */
import { useState, useEffect } from 'react';
import usePrevious from './usePrev';

function useEditable(element, callback) {
    const [editableElement, setEditableElement] = useState(null);
    const prevEditableElement = usePrevious(editableElement);

    useEffect(() => {
        if (editableElement != prevEditableElement)
        {
            if (editableElement != 'CLEAR')
                editableElement.setAttribute('contenteditable', true);

            if (prevEditableElement && prevEditableElement != "CLEAR")
            {
                prevEditableElement.setAttribute('contenteditable', false);
                callback(prevEditableElement.dataset.id, prevEditableElement.dataset.type, prevEditableElement.textContent);
            }   
        }
    }, [callback, editableElement, prevEditableElement]);

    useEffect(() => {
        if (element.current != null) {
            document.addEventListener('click', (e) => {
                if (element.current && !element.current.contains(e.target))
                    setEditableElement('CLEAR')
            });

            element.current.addEventListener('click', e => {
                let item = e.target;
                if (item.classList.contains('table__item') && item.dataset.editable == 'true') 
                {
                    setEditableElement(item);
                }
                else
                {
                    setEditableElement('CLEAR')
                }
            })
        }
    }, [element]);

    return true;
}

export default useEditable;