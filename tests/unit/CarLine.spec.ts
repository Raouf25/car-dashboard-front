import { shallowMount, Wrapper } from '@vue/test-utils'; 
  import CarLine from '@/components/CarLine.vue';
  import EditModal from '@/components/EditModal.vue';
  import DeleteModal from '@/components/DeleteModal.vue'; 
  
  describe('CarLine', () => {
    let wrapper: Wrapper<any>; 
    const car = {
      type: 'Sedan',
      model: 'Toyota Camry',
      manufacturer: 'Toyota',
      createDate: '2022-01-01',
      country: 'JP',
      id: 1
    };
  
    beforeEach(() => {
      wrapper = shallowMount(CarLine, {
        propsData: {
          car: car
        },
        components: {
          EditModal,
          DeleteModal
        }
      });
    });
  
    afterEach(() => {
      wrapper.destroy();
    });
  
    it('renders car details correctly', () => {
      const tds = wrapper.findAll('td');
      expect(tds.at(0).text()).toBe(car.type);
      expect(tds.at(1).text()).toBe(car.model);
      expect(tds.at(2).text()).toBe(car.manufacturer);
      expect(tds.at(3).text()).toBe(car.createDate);
    }); 
    
    it('renders EditModal and DeleteModal components', () => {
      expect(wrapper.findComponent(EditModal).exists()).toBe(true);
      expect(wrapper.findComponent(DeleteModal).exists()).toBe(true);
    });
  });
  