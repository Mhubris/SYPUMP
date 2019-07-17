
# coding: utf-8

# In[22]:


# Imports
from matplotlib import pyplot as plt
from math import e, pi
import numpy


# In[23]:


# Define Constants
bandwidth_freq = list(range(1000,100000000,100))
vaccum_permittivity = 8.85E-12

sc_data = {"epsilon_inf": 4.4093, "sigma_dc": 0.188, "delta_epsilon_1": 40.6,
          "tau_1": 35, "alfa_1": 0, "delta_epsilon_2": 195, "tau_2": 2.58,
           "alfa_2":0, "order": 2}
ed_data = {"epsilon_inf": 4, "sigma_dc": 0.7, "delta_epsilon_1": 56,
          "tau_1": 8.38, "alfa_1": 0.1, "delta_epsilon_2": 5200, "tau_2": 132.6,
           "alfa_2":0.1, "order": 2}
hyp_data = {"epsilon_inf": 2.5, "sigma_dc": 0.035, "delta_epsilon_1": 9,
          "tau_1": 79.6, "alfa_1": 0.2, "delta_epsilon_2": 35, "tau_2": 15.92,
           "alfa_2":0.1, "delta_epsilon_3":33000, "tau_3":159, "alfa_3":0.05, "delta_epsilon_4": 10^7
            , "tau_4": 15.9, "alfa_4":0.01 , "order": 4}


# In[24]:


def sc_complex_permitivity(freq = 100):
    sum_permitivity = sc_data["epsilon_inf"]
    for x in range(1,sc_data["order"]+1):
        sum_permitivity+=sc_data["delta_epsilon_"+str(x)]/(1+(freq*sc_data["tau_"+str(x)])*1j)
    sum_permitivity+=sc_data["sigma_dc"]/(freq*vaccum_permittivity*1j)
    return sum_permitivity


# In[25]:


def ed_complex_permitivity(freq = 100):
    sum_permitivity = ed_data["epsilon_inf"]
    for x in range(1,ed_data["order"]+1):
        sum_permitivity+=ed_data["delta_epsilon_"+str(x)]/(1+(freq*ed_data["tau_"+str(x)])*1j)
    sum_permitivity+=ed_data["sigma_dc"]/(freq*vaccum_permittivity*1j)
    return sum_permitivity


# In[26]:


def hyp_complex_permitivity(freq = 100):
    sum_permitivity = hyp_data["epsilon_inf"]
    for x in range(1,hyp_data["order"]+1):
        sum_permitivity+=hyp_data["delta_epsilon_"+str(x)]/(1+(freq*hyp_data["tau_"+str(x)])*1j)
    sum_permitivity+=hyp_data["sigma_dc"]/(freq*vaccum_permittivity*1j)
    return sum_permitivity


# In[27]:


plt.loglog(bandwidth_freq,[sc_complex_permitivity(i*2*pi).real for i in bandwidth_freq], basex=10, basey=10)
plt.grid()
plt.show()


# In[28]:


print(sc_complex_permitivity(55000*2*pi))
print(ed_complex_permitivity(55000*2*pi))
print(hyp_complex_permitivity(55000*2*pi))

