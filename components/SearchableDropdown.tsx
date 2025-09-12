import React, { useState, useMemo } from 'react';
import clsx from 'clsx';

interface DropdownOption {
  name: string;
  department?: string;
  email?: string;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: any;
  className?: string;
  showDepartment?: boolean; // 부서 정보 표시 여부
}

export function SearchableDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  error,
  className,
  showDepartment = true // 기본값은 true
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.department && option.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [options, searchTerm]);

  const selectedOption = options.find(opt => opt.name === value);

  function inputCls(err?: any) {
    return clsx('h-10 rounded-xl border px-3 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20',
      err && 'border-red-500');
  }

  return (
    <div className="relative">
      <div 
        className={clsx(inputCls(error), className, 'cursor-pointer flex items-center justify-between')}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-black' : 'text-gray-500'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-hidden">
          <div className="p-2">
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 px-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={`${option.name}-${index}`}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  onChange(option.name);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <div className="font-medium">{option.name}</div>
                {showDepartment && option.department && (
                  <div className="text-xs text-gray-500">
                    {option.department}
                  </div>
                )}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">검색 결과가 없습니다</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}