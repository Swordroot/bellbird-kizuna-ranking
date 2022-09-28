import React, { useEffect, useState } from 'react'
import axios from 'axios'
import bg from './background5.png'

import'./fonts/NotoSans_bold.woff'
import'./fonts/NotoSans_regular.woff'

const width = 1400
const height = 788

const teamColors = [
  {r:243,g:5,b:5},
  {r:2,g:139,b:51},
  {r:3,g:14,b:252},
  {r:52,g:207,b:255},
  {r:179,g:52,b:253},
  {r:232,g:217,b:2},
  {r:139,g:139,b:141},
  {r:252,g:164,b:251}
]

const rankColors = [
  {r: 219, g:65, b:4},
  {r: 219, g:65, b:4},
  {r: 219, g:65, b:4},
  {r: 219, g:65, b:4},
  {r: 25, g:135, b:0},
  {r: 25, g:135, b:0},
  {r: 110, g:107, b:106},
  {r: 110, g:107, b:106}
]

const padding = 3;


function App() {
  const [canvas, setCanvas] = useState(null)
  const [rankData, setRankData] = useState({} as any)
  // contextを状態として持つ
  const [context, setContext] = useState(null)
  // 画像読み込み完了トリガー
  const [loaded, setLoaded] = useState(false)

  const [rendering, setRendering] = useState(false);

  const [png, setPng] = useState<string | null>(null)

  // 集計シートからデータ取得
  const fetchData = async () => {
    const result = await axios(
      'https://sheets.googleapis.com/v4/spreadsheets/1dJeOXioNz1_43rSU4MKiLO_4Fa1j5h7p05X__pbFta0/values/%E3%83%81%E3%83%BC%E3%83%A0%E6%88%90%E7%B8%BE%E8%A1%A8%E7%A4%BA%E7%94%A8?key=AIzaSyC5m8oypazHmtTxiD4oCoqky_321t6Z5C8',
    );
    setRankData(result.data);
  }

  // コンポーネントの初期化完了後コンポーネント状態にコンテキストを登録
  useEffect(() => {
    const canvas: any = document.createElement("canvas")
    canvas.height = height
    canvas.width = width
    const canvasContext = (canvas as any).getContext("2d")
    setCanvas(canvas)
    setContext(canvasContext)
  }, [])
  // 状態にコンテキストが登録されたらそれに対して操作できる
  useEffect(() => {
    if (context !== null) {
      const img = new Image()
      img.src = bg
      img.onload = () => {
        const ctx = (context as any);
        ctx.drawImage(img, 0, 0)
        
        // 更にこれに続いて何か処理をしたい場合
        setLoaded(true)
      }
    }
  }, [context])
  useEffect(() => {
    if (loaded) {
      // それに続く処理
      fetchData()
    }
  }, [loaded])
  useEffect(() => {
    if (Object.keys(rankData).length > 0 && !rendering) {
      setRendering(true);
      // console.log(rankData)
      const values = rankData.values;
      const ctx: CanvasRenderingContext2D = (context as any);
      ctx.fillStyle = 'white'
      ctx.font = "30px 'NotoSansJP'"
      ctx.fillText(values[0][0], 50, 47, 900)

      ctx.fillStyle = 'white'
      ctx.font = "30px 'NotoSansJP'"
      ctx.fillText(values[0][2], 700, 47, 900)

      ctx.fillStyle = 'white'
      ctx.font = "30px 'NotoSansJP'"
      ctx.fillText(values[0][3], 970, 47, 900)

      ctx.fillStyle = 'white'
      ctx.font = "30px 'NotoSansJP'"
      ctx.fillText(values[0][4], 1190, 47, 900)

      for(let i=0; i<8;i++) {
        const rowHeight = 90
        const originX = 50
        const originY = 65 + rowHeight * i
        const rankColor = rankColors[i];
        ctx.fillStyle = `rgb(${rankColor.r},${rankColor.g},${rankColor.b}, 0.6)`
        ctx.fillRect(originX + padding, originY + padding, rowHeight - 2 * padding, rowHeight - 2 * padding)

        console.log(parseInt(values[i+1][6])-1)
        const teamColor = values[i+1][7].split(',').map((str: string) => parseInt(str)).reduce((acc: {r: number, g: number, b: number}, current: number, index: number) => {
          switch (index) {
            case 0:
              acc.r = current;
              break;
            case 1:
              acc.g = current;
              break;
            case 2:
              acc.b = current;
              break;
            default:
              break;
          }
          return acc
        }, {r:0,g:0,b:0})
        // const teamColor = teamColors[parseInt(values[i+1][6])-1]
        const gradient = ctx.createLinearGradient(originX + rowHeight + padding, originY, 1300, originY);
        gradient.addColorStop(0.0, `rgb(${teamColor.r},${teamColor.g},${teamColor.b}, 1.0)`)
        gradient.addColorStop(0.45, `rgb(${teamColor.r},${teamColor.g},${teamColor.b}, 1.0)`)
        gradient.addColorStop(0.5, `rgb(32,32,32,0.6)`)
        gradient.addColorStop(1.0, `rgb(32,32,32,0.6)`)
        ctx.fillStyle = gradient
        ctx.fillRect(originX + rowHeight + padding, originY + padding, 1204, rowHeight - 2 * padding)

        ctx.fillStyle = 'white'
        ctx.font = "60px 'NotoSansJp'"
        ctx.textAlign = 'center'
        ctx.textBaseline = "middle"
        ctx.fillText(`${i + 1}`, originX + rowHeight / 2, originY + rowHeight / 2, rowHeight - 2 * padding)

        ctx.fillStyle = 'white'
        ctx.font = "40px 'NotoSansJPBold'"
        ctx.textAlign = 'center'
        ctx.textBaseline = "middle"
        ctx.fillText(values[i+1][1], originX + rowHeight + padding * 3 + 247, originY + rowHeight / 2, 495)

        ctx.fillStyle = 'white'
        ctx.font = "60px 'NotoSansJP'"
        ctx.textAlign = 'right'
        ctx.textBaseline = "middle"
        ctx.fillText(`${values[i+1][2]}`, originX + rowHeight / 2 + 795, originY + rowHeight / 2, 300)

        if (parseFloat(values[i+1][5]) > 0) {
          ctx.fillStyle = 'green'
          ctx.font = "60px 'NotoSansJPBold'"
          ctx.textAlign = 'right'
          ctx.textBaseline = "middle"
          ctx.fillText('∧', originX + rowHeight / 2 + 855, originY + rowHeight / 2, 300)
        } else if (parseFloat(values[i+1][5]) < 0){
          ctx.fillStyle = 'red'
          ctx.font = "60px 'NotoSansJPBold'"
          ctx.textAlign = 'right'
          ctx.textBaseline = "middle"
          ctx.fillText('∨', originX + rowHeight / 2 + 855, originY + rowHeight / 2, 300)
        }

        ctx.fillStyle = 'white'
        ctx.font = "40px 'NotoSansJP'"
        ctx.textAlign = 'right'
        ctx.textBaseline = "middle"
        ctx.fillText(`${values[i+1][3]}`, originX + rowHeight / 2 + 995, originY + rowHeight / 2, 200)

        ctx.fillStyle = 'white'
        ctx.font = "30px 'NotoSansJP'"
        ctx.textAlign = 'right'
        ctx.textBaseline = "middle"
        ctx.fillText(`${values[i+1][4]}`, originX + rowHeight / 2 + 1195, originY + rowHeight / 2, 200)
      }

      setPng((canvas as any).toDataURL());
    }
  }, [rankData])
  return <div>
    <span style={
      {
        fontFamily: 'NotoSansJp'
      }
    }>フォント読み込み用</span>
    <span style={
      {
        fontFamily: 'NotoSansJpBold'
      }
    }>フォント読み込み用</span>
    <img src={png as any} alt="" />
  </div>
}
export default App