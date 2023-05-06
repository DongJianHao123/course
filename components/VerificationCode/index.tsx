import { useState, forwardRef, useImperativeHandle } from 'react'
import { isArray, some, sortBy } from 'lodash'

// import './index.scss'

const isValidRange = (num: number, excludeRange: number[] | number[][]) => {
  if (isArray(excludeRange[0])) {
    return some(excludeRange, (range: number[]) => {
      const [min, max] = sortBy(range)
      return num >= min && num <= max
    })
  } else {
    const [min, max] = sortBy(excludeRange)
    return num >= min && num <= max
  }
}

const getASCII = (max: number, min: number, excludeRange?: number[] | number[][]) => {
  let result = ~~(Math.random() * (max - min + 1) + min)
  if (excludeRange) {
    while (isValidRange(result, excludeRange)) {
      result = ~~(Math.random() * (max - min + 1) + min)
    }
  }
  return result
}

// 参考: https://cloud.tencent.com/developer/article/1466588
const getRandom = (
  max: number,
  min: number,
  num: number,
  excludeRange?: number[] | number[][]
): number[] => {
  let arr: number[] = []
  for (let i = 0; i < num; i++) {
    arr = arr.concat(getASCII(max, min, excludeRange))
  }
  return arr
}

export const VerificationCodeNum = 4

interface IData {
  nums: number[]
  rotate: number[]
  fontSize: number[]
  color: number[][]
}

const getColor = (colorArr: number[]) => {
  const [r, g, b] = colorArr
  return `rgb(${r}, ${g}, ${b})`
}
const generateRandomData = (): IData => {
  return {
    nums: getRandom(122, 48, VerificationCodeNum, [
      [58, 64],
      [91, 96]
    ]),
    rotate: getRandom(50, -50, VerificationCodeNum),
    fontSize: getRandom(12, 20, VerificationCodeNum),
    color: [
      getRandom(100, 255, 3),
      getRandom(100, 255, 3),
      getRandom(100, 255, 3),
      getRandom(100, 255, 3)
    ]
  }
}
const VerificationCode = forwardRef((props, ref) => {
  const [data, setData] = useState<IData>(generateRandomData())

  useImperativeHandle(
    ref,
    () => ({
      getCodes: () => data.nums,
      getCodesAsString: (caseInsensitive?: boolean) => {
        const codeString = data.nums.map((num) => String.fromCharCode(num)).join('')
        return caseInsensitive ? codeString.toLowerCase() : codeString
      }
    }),
    [data]
  )

  return (
    <div className="verification-code-box" onClick={() => setData(generateRandomData())}>
      {data.nums.map((num, index) => (
        <span
          key={index}
          style={{
            color: getColor(data.color[index]),
            fontSize: data.fontSize[index],
            transform: `rotate(${data.rotate[index]}deg)`
          }}
        >
          {String.fromCharCode(num)}
        </span>
      ))}
    </div>
  )
})

export default VerificationCode
