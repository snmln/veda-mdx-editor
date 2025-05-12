import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@trussworks/react-uswds';

interface DropdownOption {
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  onSelect: (value: string) => void;
  buttonText: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className='dropdown' ref={dropdownRef}>
      <button onClick={toggleDropdown}>
        <svg
          width='28'
          height='18'
          viewBox='0 0 28 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='margin-right-05 width-3 height-3'
        >
          <path d='M0 0H13V18H0V0Z' fill='black' />
          <path d='M27.7391 14V17.5H16V14H27.7391Z' fill='black' />
          <path d='M27.7391 0V3.5H16V0H27.7391Z' fill='black' />
          <path d='M27.7391 7.5V11H16V7.5H27.7391Z' fill='black' />
        </svg>
        Add 2 Column <Icon.ArrowDropDown />
      </button>
      {isOpen && (
        <ul className='dropdown-menu'>
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
            >
              Add 2 Column
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
