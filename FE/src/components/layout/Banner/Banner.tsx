import { Carousel } from 'antd'
import banner1 from '../../../assets/banner1.png'
import banner2 from '../../../assets/banner2.png'

const banners = [banner1, banner2]

export const Banner = () => {
  return (
    <Carousel autoplay>
      {banners.map((banner, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          <img
            src={banner}
            alt={`Banner ${index + 1}`}
            style={{
              width: '100%',
              height: '450px',
              objectFit: 'cover',
              borderRadius: '12px',
            }}
          />
        </div>
      ))}
    </Carousel>
  )
}
