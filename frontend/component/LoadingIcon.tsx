const LoadingIcon = () => {
    return (
      <div className="flex justify-center items-center">
        <svg
          className="w-12 h-8"
          viewBox="0 0 50 31.25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Loading"
        >
          <path
            className="track"
            stroke="currentColor"
            strokeWidth="4"
            d="M0.625 21.5h10.25l3.75-5.875 7.375 15 9.75-30 7.375 20.875h10.25"
            opacity="0.1"
          />
          <path
            className="car"
            stroke="currentColor"
            strokeWidth="4"
            d="M0.625 21.5h10.25l3.75-5.875 7.375 15 9.75-30 7.375 20.875h10.25"
            strokeDasharray="100"
            strokeDashoffset="100"
            strokeLinecap="round"
            strokeLinejoin="round"
          >

            <animate
              attributeName="stroke-dashoffset"
              from="100"
              to="0"
              dur="1s" 
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.2;0.55;1"
              dur="0.75s" 
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    );
  };
  
  export default LoadingIcon;
  