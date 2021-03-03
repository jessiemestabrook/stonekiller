import React from 'react'

function ProgressBar({start, end, currentTime}) {
  let percentage = 0
  if (start < currentTime && end > currentTime) {
    percentage = ((currentTime - start) / (end - start))
  } else if (end < currentTime) {
    percentage = 1;
  }
  return (
    <svg viewBox="0 0 500 60" xmlns="http://www.w3.org/2000/svg">
      <defs></defs>
      <rect x="0" y="0" width={500 * percentage} height="60" style={{fill: "rgb(86, 255, 179)"}}
      />

      <circle style={{fill: "rgb(255, 252, 252)"}} cx="462.93" cy="30" r="21.07"
      />
      {percentage === 1 &&

        <path
          d="M 911.813 209.746 L 917.728 226.764 L 935.742 227.131 L 921.384 238.016 L 926.602 255.261 L 911.813 244.97 L 897.024 255.261 L 902.242 238.016 L 887.884 227.131 L 905.898 226.764 Z"
          style={{fill: "rgb(224, 121, 255)"}}
          transform="matrix(-0.828358, 0.560199, -0.560199, -0.828358, 1348.350137, -285.180281)"
        />

      }
    </svg>
  );
}

export default ProgressBar;
